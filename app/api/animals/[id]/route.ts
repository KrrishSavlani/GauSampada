import { NextResponse } from "next/server";
import DBConnect from "@/lib/dbConnect";
import Animal from "@/models/Animal";
import "@/models/users"; // ensure User model is registered
import mongoose from "mongoose";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid animal ID" },
                { status: 400 }
            );
        }

        const db = new DBConnect();
        await db.connect();

        // ✅ MUST await
        const animal = await Animal.findById(id)
            .populate("seller", "name email phone")
            .lean();

        if (!animal) {
            return NextResponse.json(
                { message: "Animal not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ animal }, { status: 200 });
    } catch (error) {
        console.error("Error fetching animal by ID:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
