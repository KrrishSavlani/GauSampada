// typescript
import mongoose, { Document, Schema } from "mongoose"

export interface IAnimal extends Document {
    listingId: string
    species: "cow" | "cattle" | "buffalo"
    name?: string
    breed?: string
    ageMonths?: number
    gender?: "male" | "female" | "unknown"
    price: number
    weightKg?: number
    seller: mongoose.Types.ObjectId
    buyer?: mongoose.Types.ObjectId | null
    location?: string
    description?: string
    images?: string[]
    status: "available" | "reserved" | "sold"
    createdAt: Date
    updatedAt: Date
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
        name: { type: String },
        breed: { type: String },
        ageMonths: { type: Number },
        gender: { type: String, enum: ["male", "female", "unknown"], default: "unknown" },
        price: { type: Number, required: true },
        weightKg: { type: Number },
        seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
        buyer: { type: Schema.Types.ObjectId, ref: "User", default: null },
        location: { type: String },
        description: { type: String },
        images: { type: [String], default: [] },
        status: { type: String, enum: ["available", "reserved", "sold"], default: "available" },
    },
    { timestamps: true }
);

// Use a plain callback type for next to avoid missing mongoose export
(AnimalSchema as any).pre("save", function (this: IAnimal & Document, next: (err?: any) => void) {
    if (this.status !== "sold") {
        this.buyer = null
    }
    next()
})

export default mongoose.model<IAnimal>("Animal", AnimalSchema)
