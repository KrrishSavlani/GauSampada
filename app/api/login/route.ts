import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import DBConnect from "@/lib/dbConnect";
import User from "@/models/users";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // 1️⃣ Validate input
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        // 2️⃣ Connect DB
        const db = new DBConnect();
        await db.connect();

        // 3️⃣ Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // 4️⃣ Compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // 5️⃣ Success (NO password data returned)
        return NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                },
            },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("Login error:", err);

        // Mongo auth / connection error
        if (
            err?.code === 13 ||
            (err?.name === "MongoServerError" &&
                /auth|authentication/i.test(err?.message || ""))
        ) {
            return NextResponse.json(
                {
                    message:
                        "Database authentication failed. Check MONGO_URI and credentials.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: err?.message || "Internal server error" },
            { status: 500 }
        );
    }
}
