import { Request, Response } from "express";
import { registerUser, loginUser, refreshAccessToken, logoutUser } from "./auth.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await registerUser(email, password);

        res.status(201).json({
            message: "User registered",
            userId: user.id,
        });
    } catch (error: any) {
        res.status(400).json({
            error: error.message,
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const tokens = await loginUser(email, password);

        res.json(tokens);
    } catch (error: any) {
        res.status(401).json({
            error: error.message,
        });
    }
};


export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        const accessToken = await refreshAccessToken(refreshToken);

        res.json({ accessToken });
    } catch (error: any) {
        res.status(401).json({
            error: error.message,
        });
    }
};



export const logout = async (req: AuthRequest, res: Response) => {
    try {
        await logoutUser(req.userId!);

        res.json({
            message: "Logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: "Logout failed",
        });
    }
};

