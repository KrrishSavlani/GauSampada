import NextAuth , {DefaultSession , DefaultUser } from "next-auth"

//extend the built in User object
declare module "next-auth" {
    interface User extends DefaultUser {
        id: string;
        email: string;
        userName ?: string;
    }

    interface Session {
        user : {
            id: string;
            email: string;
            userName ?: string;
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        userName ?: string;
    }
}