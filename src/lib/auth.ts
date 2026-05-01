import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {captcha} from "better-auth/plugins";
import {prisma} from "./db";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [process.env.BETTER_AUTH_URL!],
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        captcha({
            provider: "hcaptcha",
            secretKey: process.env.HCAPTCHA_SECRET_KEY!,
        }),
    ],
    user: {
        deleteUser: {
            enabled: true,
        }
    }
});