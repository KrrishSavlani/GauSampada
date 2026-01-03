import Bg from "@/components/bg";

type Seller = {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
};

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
    seller: Seller | string;
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

    const seller = typeof animal.seller === 'object' ? animal.seller : null;
    const phoneNumber = seller?.phone || "Not available";

    return (
        <div className="pb-24 px-4 min-h-screen">
            <Bg />

            <div className="max-w-3xl mx-auto mt-20">
                {/* Image Section - Top (Large Horizontal Rectangle) */}
                <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl mb-6 overflow-hidden">
                    <div className="w-full h-66 bg-gray-100">
                        {animal.images && animal.images.length > 0 ? (
                            <img
                                src={animal.images[0]}
                                alt={animal.name || "Animal"}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No image available
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Section - Bottom (Wider Rectangle with Organized Lines) */}
                <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                            {animal.name || "Unnamed Animal"}
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            {animal.breed && `${animal.breed} • `}
                            <span className="capitalize">{animal.species}</span>
                        </p>
                    </div>

                    {/* Organized Details List */}
                    <div className="space-y-0">
                        <div className="flex justify-between items-center py-4 border-b border-gray-100">
                            <span className="text-gray-600 font-medium">Price</span>
                            <span className="text-xl md:text-2xl font-bold text-emerald-600">
                                ₹{animal.price.toLocaleString()}
                            </span>
                        </div>

                        {animal.ageMonths && (
                            <div className="flex justify-between items-center py-4 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Age</span>
                                <span className="text-gray-900 font-semibold">
                                    {animal.ageMonths} {animal.ageMonths === 1 ? 'month' : 'months'}
                                </span>
                            </div>
                        )}

                        {animal.gender && (
                            <div className="flex justify-between items-center py-4 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Gender</span>
                                <span className="text-gray-900 font-semibold capitalize">
                                    {animal.gender}
                                </span>
                            </div>
                        )}

                        {animal.weightKg && (
                            <div className="flex justify-between items-center py-4 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Weight</span>
                                <span className="text-gray-900 font-semibold">
                                    {animal.weightKg} kg
                                </span>
                            </div>
                        )}

                        {animal.location && (
                            <div className="flex justify-between items-center py-4 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">Location</span>
                                <span className="text-gray-900 font-semibold text-right max-w-[60%]">
                                    {animal.location}
                                </span>
                            </div>
                        )}

                        {animal.description && (
                            <div className="py-4 border-b border-gray-100">
                                <div className="text-gray-600 font-medium mb-2">Description</div>
                                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                                    {animal.description}
                                </p>
                            </div>
                        )}

                        {/* Phone Number - No button, just display */}
                        <div className="flex justify-between items-center py-4">
                            <span className="text-gray-600 font-medium">Phone Number</span>
                            <a 
                                href={`tel:${phoneNumber}`}
                                className="text-lg md:text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                {phoneNumber}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}