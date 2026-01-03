import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import DBConnect from "@/lib/dbConnect";
import Animal from "@/models/Animal";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: Request) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
          { message: "Unauthorized. Please log in." },
          { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();

    // Extract form fields
    const species = formData.get("species") as string;
    const name = formData.get("name") as string;
    const breed = formData.get("breed") as string;
    const ageMonths = formData.get("ageMonths") as string;
    const gender = formData.get("gender") as string;
    const price = formData.get("price") as string;
    const weightKg = formData.get("weightKg") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;

    // Validate required fields
    if (!species || !price) {
      return NextResponse.json(
          { message: "Species and price are required" },
          { status: 400 }
      );
    }

    // Get image files
    const imageFiles = formData.getAll("images").filter(
        (file) => file instanceof File && file.size > 0
    ) as File[];

    if (imageFiles.length === 0) {
      return NextResponse.json(
          { message: "At least one image is required" },
          { status: 400 }
      );
    }

    // Connect to database
    const db = new DBConnect();
    await db.connect();

    // Save images to public/uploads directory
    const uploadsDir = join(process.cwd(), "public", "uploads");

    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const imagePaths: string[] = [];

    for (const imageFile of imageFiles) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const originalName = imageFile.name || "image";
      const fileExtension = originalName.split(".").pop() || "jpg";
      const fileName = `${timestamp}-${randomStr}.${fileExtension}`;
      const filePath = join(uploadsDir, fileName);

      // Write file to disk
      await writeFile(filePath, buffer);

      // Store relative path for database
      imagePaths.push(`/uploads/${fileName}`);
    }

    // Create animal document
    const animalData: any = {
      species: species as "cow" | "cattle" | "buffalo",
      price: Number(price),
      seller: session.user.id,
      images: imagePaths,
      status: "available",
    };

    // Add optional fields if provided
    if (name) animalData.name = name;
    if (breed) animalData.breed = breed;
    if (ageMonths) animalData.ageMonths = Number(ageMonths);
    if (gender) animalData.gender = gender as "male" | "female" | "unknown";
    if (weightKg) animalData.weightKg = Number(weightKg);
    if (location) animalData.location = location;
    if (description) animalData.description = description;

    const newAnimal = new Animal(animalData);
    await newAnimal.save();

    return NextResponse.json(
        { message: "Animal listing created successfully", animalId: newAnimal._id },
        { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating animal listing:", err);
    return NextResponse.json(
        { message: err?.message || "Internal server error" },
        { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Connect to database
    const db = new DBConnect();
    await db.connect();

    const { searchParams } = new URL(request.url);

    // Optional filters
    const species = searchParams.get("species");
    const status = searchParams.get("status") || "available";
    const location = searchParams.get("location");

    // Build query dynamically
    const query: any = {};

    if (species) query.species = species;
    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: "i" };

    const animals = await Animal.find(query)
        .sort({ createdAt: -1 }) // latest first
        .populate("seller", "name email") // optional
        .lean();

    return NextResponse.json(
        {
          count: animals.length,
          animals,
        },
        { status: 200 }
    );
  } catch (err: any) {
    console.error("Error fetching animals:", err);
    return NextResponse.json(
        { message: err?.message || "Internal server error" },
        { status: 500 }
    );
  }
}