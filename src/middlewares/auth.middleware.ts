import {
    Request,
    Response,
    NextFunction,
} from "express";

import { prisma } from "../config/db";

import {
    verifyAccessToken,
} from "../utils/jwt";

export interface AuthRequest
    extends Request {

    userId?: number;
}

export const authMiddleware =
    async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const header =
                req.headers.authorization;

            if (!header)
                return res
                    .status(401)
                    .json({
                        error:
                            "Missing token",
                    });

            const token =
                header.split(" ")[1];

            const decoded =
                verifyAccessToken(token);

            const user =
                await prisma.user.findUnique({
                    where: {
                        id: decoded.userId,
                    },
                });

            if (
                !user ||
                user?.tokenVersion !==
                decoded.tokenVersion
            )
                return res
                    .status(401)
                    .json({
                        error:
                            "Token invalid",
                    });

            req.userId = user.id;

            next();

        } catch {

            return res
                .status(401)
                .json({
                    error:
                        "Token expired",
                });

        }
    };
