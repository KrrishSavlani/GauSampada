import Bg from "@/components/bg";

type Animal = {
    _id: string;
    name?: string;
    breed?: string;
    species: string;
    ageMonths?: number;
    gender?: string;
    price: number;
    weightKg?: number;
    location?: string;
    description?: string;
    images: string[];
};

async function getAnimal(id: string): Promise<Animal | null> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/animals/${id}`,
        { cache: "no-store" }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.animal;
}

export default async function AnimalDetails({
                                                params,
                                            }: {
    params: Promise<{ id: string }>;
}) {
    // ✅ THIS IS THE ONLY CORRECT WAY
    const { id } = await params;

    if (!id) {
        return (
            <div className="p-6 text-center text-gray-600">
                Invalid animal ID
            </div>
        );
    }

    const animal = await getAnimal(id);

    if (!animal) {
        return (
            <div className="p-6 text-center text-gray-600">
                Animal not found
            </div>
        );
    }

    return (
        <div className="pb-24 px-4">
            <Bg />

            <div className="max-w-3xl mx-auto mt-20 bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6">

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {animal.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt="animal"
                            className="w-full h-48 object-cover rounded-xl"
                        />
                    ))}
                </div>

                <h1 className="text-2xl font-bold mb-2">
                    {animal.name || "Animal"}
                </h1>

                <p className="text-gray-600 mb-4">
                    {animal.breed} • {animal.species}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><strong>Price:</strong> ₹{animal.price.toLocaleString()}</p>
                    <p><strong>Age:</strong> {animal.ageMonths ?? "—"} months</p>
                    <p><strong>Gender:</strong> {animal.gender ?? "—"}</p>
                    <p><strong>Weight:</strong> {animal.weightKg ?? "—"} kg</p>
                    <p className="col-span-2">
                        <strong>Location:</strong> {animal.location ?? "—"}
                    </p>
                </div>

                {animal.description && (
                    <div className="mt-4">
                        <h3 className="font-semibold mb-1">Description</h3>
                        <p className="text-gray-700 text-sm">
                            {animal.description}
                        </p>
                    </div>
                )}

                <button
                    className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700
          text-white py-3 rounded-xl font-semibold transition"
                >
                    Contact Seller
                </button>
            </div>
        </div>
    );
}
