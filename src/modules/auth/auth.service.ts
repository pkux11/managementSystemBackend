import { prisma } from "../../config/db";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from "../../utils/jwt";

export const registerUser = async (email: string, password: string) => {
    const existing = await prisma.user.findUnique({
        where: { email },
    });

    if (existing) {
        throw new Error("User already exists");
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashed,
        },
    });

    return user;
};


export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const valid = await comparePassword(password, user.password);

    if (!valid) {
        throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    return { accessToken, refreshToken };
};


export const refreshAccessToken = async (refreshToken: string) => {
    const decoded = verifyRefreshToken(refreshToken) as {
        userId: number;
    };

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
        throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(user.id);

    return newAccessToken;
};

export const logoutUser = async (userId: number) => {
    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
};

