"use client";

import { useEffect, useState } from "react";
import AnimalCard from "@/components/animalCard";
import Bg from "@/components/bg";
import Link from "next/link";

type Animal = {
    _id: string;
    name?: string;
    breed?: string;
    ageMonths?: number;
    price: number;
    location?: string;
    images: string[];
};

export default function Marketplace() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const res = await fetch("/api/animals?status=available");
                const data = await res.json();
                setAnimals(data.animals || []);
            } catch (err) {
                console.error("Failed to fetch animals", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimals();
    }, []);

    return (
        <div className="pb-28 px-4">
            <Bg />

            {/* Loading */}
            {loading && (
                <p className="mt-20 text-center text-gray-600">
                    Loading animals...
                </p>
            )}

            {/* Empty State */}
            {!loading && animals.length === 0 && (
                <p className="mt-20 text-center text-gray-600">
                    No animals available for sale 🐄
                </p>
            )}

            {/* Animal Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
                {animals.map((animal) => (
                    <AnimalCard
                        key={animal._id}
                        animal={{
                            id: animal._id, // 👈 REQUIRED
                            name: animal.name || "Animal",
                            breed: animal.breed || "Unknown",
                            age: animal.ageMonths
                                ? `${Math.floor(animal.ageMonths / 12)} Years`
                                : "—",
                            price: `₹${animal.price.toLocaleString()}`,
                            location: animal.location || "Unknown",
                            image: animal.images?.[0] || "/images/placeholder.jpg",
                        }}
                    />
                ))}
            </div>

            {/* Floating Sell Button */}
            <Link href="/sellForm">
                <button
                    className="fixed bottom-20 right-4 z-50 flex items-center gap-2
          bg-orange-400 hover:bg-orange-300 text-white
          px-6 py-3 rounded-full shadow-xl
          font-semibold transition-all duration-300
          hover:scale-105 active:scale-95"
                >
                    <span className="text-lg">🐄</span>
                    Sell
                </button>
            </Link>
        </div>
    );
}
