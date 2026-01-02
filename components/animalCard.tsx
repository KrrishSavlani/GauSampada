import Link from "next/link";

type Props = {
    animal: {
        id: string;          // 👈 add id
        name: string;
        breed: string;
        age: string;
        price: string;
        location: string;
        image: string;
    };
};

export default function AnimalCard({ animal }: Props) {
    return (
        <div className="group bg-white/90 backdrop-blur rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">

            <img
                src={animal.image}
                alt={animal.name}
                className="w-full h-48 object-contain rounded-t-2xl"
            />

            <div className="p-4">
                <h2 className="text-lg font-bold">{animal.name}</h2>

                <p className="text-sm text-gray-600">
                    {animal.breed} • {animal.age}
                </p>

                <p className="font-semibold mt-1">{animal.price}</p>
                <p className="text-xs text-gray-500">{animal.location}</p>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                    <Link
                        href={`/marketplace/${animal.id}`}
                        className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700
            text-white py-2 rounded-xl font-medium transition"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
