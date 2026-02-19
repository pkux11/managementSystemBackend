import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface AccessPayload {
    userId: number;
    tokenVersion: number;
}

export interface RefreshPayload {
    userId: number;
}

export const generateAccessToken = (
    userId: number,
    tokenVersion: number
) => {
    return jwt.sign(
        { userId, tokenVersion },
        ACCESS_SECRET,
        { expiresIn: "15m" }
    );
};

export const generateRefreshToken = (
    userId: number
) => {
    return jwt.sign(
        { userId },
        REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};

export const verifyAccessToken = (
    token: string
) => {
    return jwt.verify(
        token,
        ACCESS_SECRET
    ) as AccessPayload;
};

export const verifyRefreshToken = (
    token: string
) => {
    return jwt.verify(
        token,
        REFRESH_SECRET
    ) as RefreshPayload;
};
