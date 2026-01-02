import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import DBConnect from "@/lib/dbConnect";
import User from "@/models/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, phone, address } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const db = new DBConnect();
    await db.connect();

    // check existing
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: 'Username already taken' }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, passwordHash, phone, address });
    await newUser.save();

    return NextResponse.json({ message: 'User created' }, { status: 201 });
  } catch (err: any) {
    console.error('Signup error:', err);

    // If DB returned a MongoAuthError (we set code 13 in DBConnect), return helpful message
    if (err?.code === 13 || (err?.name === 'MongoServerError' && /auth|authentication/i.test(err?.message || '')) ) {
      return NextResponse.json({ message: 'Database authentication failed. Check MONGO_URI and credentials.' }, { status: 500 });
    }

    return NextResponse.json({ message: err?.message || 'Internal error' }, { status: 500 });
  }
}
