import { Request, Response } from "express";
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
} from "./auth.service";

import { AuthRequest } from "../../middlewares/auth.middleware";


// REGISTER
export const register =
    async (req: Request, res: Response) => {

        try {

            const { email, password } =
                req.body;

            const user =
                await registerUser(
                    email,
                    password
                );

            res.status(201).json({
                message:
                    "Registration successful",
                user: {
                    id: user.id,
                    email: user.email,
                },
            });

        } catch (error: any) {

            res.status(400).json({
                error: error.message,
            });

        }
    };


// LOGIN
export const login =
    async (req: Request, res: Response) => {

        try {

            const { email, password } =
                req.body;

            const tokens =
                await loginUser(
                    email,
                    password
                );

            res.json({
                message: "Login successful",
                ...tokens,
            });

        } catch (error: any) {

            res.status(401).json({
                error: error.message,
            });

        }
    };



// REFRESH
export const refresh =
    async (req: Request, res: Response) => {

        try {

            const { refreshToken } =
                req.body;

            const accessToken =
                await refreshAccessToken(
                    refreshToken
                );

            res.json({
                accessToken,
            });

        } catch (error: any) {

            res.status(401).json({
                error: error.message,
            });

        }
    };



// LOGOUT
export const logout =
    async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            await logoutUser(
                req.userId!
            );

            res.json({
                message:
                    "Logout successful",
            });

        } catch {

            res.status(500).json({
                error: "Logout failed",
            });

        }
    };
