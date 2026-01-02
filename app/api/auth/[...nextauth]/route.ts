import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import DBConnect from "@/lib/dbConnect";
import User from "@/models/users";

import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {

                const dbConnection = new DBConnect();
                console.log("Connecting to DB for auth...");
                await dbConnection.connect();
                console.log("Connected to DB for auth.");

                // ensure credentials are present
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await User.findOne({ email: credentials.email });

                if (!user) return null

                // compare against the instance's passwordHash
                const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

                if(!isPasswordValid) return null;

                console.log("SUCCESS LOGIN");
                console.log("----------------------");

                return {
                    id: user._id.toString(),
                    email: user.email,
                    username: user.username
                };
            }
        })
    ],

    session: { strategy: "jwt" as const },

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: any }) {
            // On initial sign-in, persist fields from the returned user
            if (user) {
                token.id = (user as any).id;
                token.email = (user as any).email;
                token.username = (user as any).username;
                return token;
            }

            // If token is missing critical fields (e.g., stale cookie), hydrate from DB
            if (!token.username && token.email) {
                const dbConnection = new DBConnect();
                await dbConnection.connect();
                // fetch user from the User model to hydrate the token
                const usr = await User.findOne({ email: token.email });
                if (usr) {
                    token.id = usr._id.toString();
                    token.email = usr.email;
                    token.username = usr.username;
                    // optional: token.role = usr.role;
                }
            }

            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                // expose consistent "username" to the client session
                (session.user as any).username = token.username as string | undefined;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
