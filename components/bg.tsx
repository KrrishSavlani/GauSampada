export default function Bg() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">

            {/* Base light gradient */}
            <div className="absolute inset-0 bg-gradient-to-br
        from-[#f8f5f0] via-[#eef6f1] to-[#e6f2ee]" />

            {/* Soft organic blobs */}
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px]
        bg-green-300/20 rounded-full blur-3xl" />

            <div className="absolute top-1/4 -right-40 w-[500px] h-[500px]
        bg-emerald-200/25 rounded-full blur-3xl" />

            <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px]
        bg-teal-200/20 rounded-full blur-3xl" />

            {/* Light grain texture */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
                    backgroundSize: "22px 22px",
                }}
            />
        </div>
    );
}
