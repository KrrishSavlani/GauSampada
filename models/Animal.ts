import mongoose, { Document, Schema } from "mongoose";

export interface IAnimal extends Document {
    listingId: string;
    species: "cow" | "cattle" | "buffalo";
    name?: string;
    breed?: string;
    ageMonths?: number;
    gender?: "male" | "female" | "unknown";
    price: number;
    weightKg?: number;
    seller: mongoose.Types.ObjectId;
    buyer?: mongoose.Types.ObjectId | null;
    location?: string;
    description?: string;
    images?: string[];
    status: "available" | "reserved" | "sold";
    createdAt: Date;
    updatedAt: Date;
}

const AnimalSchema = new Schema<IAnimal>(
    {
        listingId: {
            type: String,
            required: true,
            unique: true,
            default: () => new mongoose.Types.ObjectId().toHexString(),
        },
        species: {
            type: String,
            enum: ["cow", "cattle", "buffalo"],
            required: true,
        },
        name: String,
        breed: String,
        ageMonths: Number,
        gender: {
            type: String,
            enum: ["male", "female", "unknown"],
            default: "unknown",
        },
        price: { type: Number, required: true },
        weightKg: Number,
        seller: { type: Schema.Types.ObjectId, ref: "user", required: true },
        buyer: { type: Schema.Types.ObjectId, ref: "user", default: null },
        location: String,
        description: String,
        images: { type: [String], default: [] },
        status: {
            type: String,
            enum: ["available", "reserved", "sold"],
            default: "available",
        },
    },
    { timestamps: true }
);

// ✅ SAFE pre-save hook (NO next)
AnimalSchema.pre("save", async function () {
    if (this.status !== "sold") {
        this.buyer = null;
    }
});

// ✅ HMR-safe export
const AnimalModel =
    mongoose.models?.Animal ||
    mongoose.model<IAnimal>("Animal", AnimalSchema);

export default AnimalModel;
