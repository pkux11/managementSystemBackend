import { prisma } from "../../config/db";
import {
    hashPassword,
    comparePassword,
} from "../../utils/bcrypt";

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../../utils/jwt";


// REGISTER
export const registerUser = async (
    email: string,
    password: string
) => {

    const existing =
        await prisma.user.findUnique({
            where: { email },
        });

    if (existing) {
        throw new Error("User already exists");
    }

    const hashed =
        await hashPassword(password);

    const user =
        await prisma.user.create({
            data: {
                email,
                password: hashed,
            },
        });

    return user;
};



// LOGIN
export const loginUser = async (
    email: string,
    password: string
) => {

    const user =
        await prisma.user.findUnique({
            where: { email },
        });

    if (!user)
        throw new Error("Invalid credentials");

    const valid =
        await comparePassword(
            password,
            user.password
        );

    if (!valid)
        throw new Error("Invalid credentials");

    const accessToken =
        generateAccessToken(
            user.id,
            user?.tokenVersion
        );

    const refreshToken =
        generateRefreshToken(user.id);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
        },
    };
};



// REFRESH ACCESS TOKEN
export const refreshAccessToken =
    async (refreshToken: string) => {

        if (!refreshToken)
            throw new Error("Missing refresh token");

        const decoded =
            verifyRefreshToken(refreshToken);

        const user =
            await prisma.user.findUnique({
                where: { id: decoded.userId },
            });

        if (
            !user ||
            user.refreshToken !== refreshToken
        )
            throw new Error(
                "Invalid refresh token"
            );

        const newAccessToken =
            generateAccessToken(
                user.id,
                user?.tokenVersion
            );

        return newAccessToken;
    };



export const logoutUser =
    async (userId: number) => {

        await prisma.user.update({
            where: { id: userId },
            data: {
                refreshToken: null,
                tokenVersion: {
                    increment: 1,
                },
            },
        });
    };
