'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Bg from '@/components/bg';
import AnimalCard from '@/components/animalCard';
import Link from 'next/link';

type Animal = {
    _id: string;
    name?: string;
    breed?: string;
    ageMonths?: number;
    price: number;
    location?: string;
    images: string[];
    status: string;
};


export default function MySells() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/animals/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                alert("Failed to delete animal");
                return;
            }

            // ✅ Update UI instantly
            setAnimals(prev =>
                prev.filter(animal => animal._id !== id)
            );
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated' && session?.user?.id) {
            fetchMySells();
        }
    }, [status, session, router]);

    const fetchMySells = async () => {
        try {
            const res = await fetch('/api/animals');
            const data = await res.json();
            // Filter animals by current user (seller)
            const userId = session?.user?.id;
            const myAnimals = data.animals?.filter((animal: any) => {
                // Handle both populated and non-populated seller
                const sellerId = animal.seller?._id?.toString() || animal.seller?.toString() || animal.seller;
                return sellerId === userId;
            }) || [];
            setAnimals(myAnimals);
        } catch (err) {
            console.error('Failed to fetch my sells', err);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="pb-28 px-4">
                <Bg />
                <div className="mt-20 text-center text-gray-600">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="pb-28 px-4">
            <Bg />

            <div className="max-w-6xl mx-auto mt-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Sells</h1>
                    <p className="text-gray-600">Manage your animal listings</p>
                </div>

                {animals.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-12 text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-gray-400 mx-auto mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                        </svg>
                        <p className="text-gray-600 mb-4">You haven't listed any animals yet.</p>
                        <Link
                            href="/sellForm"
                            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            List Your First Animal
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {animals.map((animal) => (
                            <AnimalCard
                                key={animal._id}
                                animal={{
                                    id: animal._id,
                                    name: animal.name || 'Animal',
                                    breed: animal.breed || 'Unknown',
                                    age: animal.ageMonths
                                        ? `${Math.floor(animal.ageMonths / 12)} Years`
                                        : '—',
                                    price: `₹${animal.price.toLocaleString()}`,
                                    location: animal.location || 'Unknown',
                                    image: animal.images?.[0] || '/images/placeholder.jpg',
                                }}
                            showDelete={true}
                                onDelete={handleDelete}


                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

