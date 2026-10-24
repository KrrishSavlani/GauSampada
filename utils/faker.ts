import "dotenv/config";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

import Animal from "../models/Animal";
import User from "../models/users";

// ------------------------------------------
// CONFIGURATION
// ------------------------------------------


const TOTAL_RECORDS = Number(process.env.SEED_COUNT ?? 10_000);
const BATCH_SIZE = 5_0000;

// ------------------------------------------
// FAKE DATA
// ------------------------------------------

const species = ["cow", "cattle", "buffalo"] as const;

const breeds = [
    "Gir",
    "Sahiwal",
    "Jersey",
    "Holstein Friesian",
    "Red Sindhi",
    "Murrah",
    "Mehsana",
    "Kankrej",
    "Tharparkar",
];

const locations = [
    "Junagadh, Gujarat",
    "Rajkot, Gujarat",
    "Ahmedabad, Gujarat",
    "Amreli, Gujarat",
    "Bhavnagar, Gujarat",
    "Jamnagar, Gujarat",
    "Surat, Gujarat",
    "Vadodara, Gujarat",
    "Anand, Gujarat",
    "Gandhinagar, Gujarat",
];

const genders = ["male", "female", "unknown"] as const;

const statuses = ["available", "reserved", "sold"] as const;

// ------------------------------------------
// RANDOM HELPERS
// ------------------------------------------

function randomItem<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(): Date {
    const now = Date.now();
    const threeYears = 3 * 365 * 24 * 60 * 60 * 1000;

    return new Date(
        now - Math.floor(Math.random() * threeYears)
    );
}

// ------------------------------------------
// GENERATE AN ANIMAL
// ------------------------------------------

function generateAnimal(sellerIds: mongoose.Types.ObjectId[]) {
    const status = randomItem(statuses);

    // Only sold animals receive a buyer.
    const buyer =
        status === "sold"
            ? randomItem(sellerIds)
            : null;

    const createdAt = randomDate();

    return {
        listingId: new mongoose.Types.ObjectId().toHexString(),

        species: randomItem(species),

        name: faker.animal.cow(),

        breed: randomItem(breeds),

        ageMonths: randomNumber(6, 180),

        gender: randomItem(genders),

        price: randomNumber(15_000, 150_000),

        weightKg: randomNumber(80, 800),

        seller: randomItem(sellerIds),

        buyer,

        location: randomItem(locations),

        description: faker.lorem.paragraph(),

        images: [faker.image.url()],

        status,

        createdAt,

        updatedAt: createdAt,
    };
}

// ------------------------------------------
// MAIN SEED FUNCTION
// ------------------------------------------

async function seedAnimals() {
    try {
        if (!Number.isSafeInteger(TOTAL_RECORDS) || TOTAL_RECORDS < 1) {
            throw new Error("SEED_COUNT must be a positive integer.");
        }

        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error("MONGO_URI is missing from your .env file.");
        }

        console.log("Connecting to MongoDB...");

        await mongoose.connect(mongoUri);

        console.log("Connected to MongoDB.");

        // WARNING: Deletes ALL existing animal listings.
        const result = await Animal.deleteMany({});

        console.log(`Deleted ${result.deletedCount} existing animals.`);

        // Retrieve actual users for valid seller references.
        // const users = await User.find()
        //     .select("_id")
        //     .lean();

        const sellerIds = [
            new mongoose.Types.ObjectId("6ad99f3db32351ce8e5cc32c")
        ];

        if (sellerIds.length === 0) {
            throw new Error(
                "No users found. Create users before seeding animals."
            );
        }

        console.log(`Found ${sellerIds.length} existing users.`);
        console.log(`Target records: ${TOTAL_RECORDS}`);
        console.log(`Batch size: ${BATCH_SIZE}`);

        let inserted = 0;

        while (inserted < TOTAL_RECORDS) {
            const currentBatchSize = Math.min(
                BATCH_SIZE,
                TOTAL_RECORDS - inserted
            );

            const batch = Array.from(
                { length: currentBatchSize },
                () => generateAnimal(sellerIds)
            );

            await Animal.insertMany(batch, {
                ordered: false,
            });

            inserted += batch.length;

            const percentage = (
                (inserted / TOTAL_RECORDS) * 100
            ).toFixed(2);

            console.log(
                `Inserted ${inserted.toLocaleString()} / ` +
                `${TOTAL_RECORDS.toLocaleString()} (${percentage}%)`
            );
        }

        console.log("Animal seeding completed successfully.");
    } catch (error) {
        console.error("Animal seeding failed:", error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB connection closed.");
    }
}

seedAnimals();