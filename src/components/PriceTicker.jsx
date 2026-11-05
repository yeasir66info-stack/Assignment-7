const sampleItems = [
    { id: 1, emoji: '🍚', name: 'স্বর্ণরাজী চাল', price: 48, unit: 'কেজি', change: 2.1, up: true },
    { id: 2, emoji: '🍚', name: 'মিনিকেট চাল', price: 69, unit: 'কেজি', change: 2.9, up: false },
    { id: 3, emoji: '🍚', name: 'বাটাম সাইজ চাল', price: 66, unit: 'কেজি', change: 3.1, up: true },
    { id: 4, emoji: '🫘', name: 'মসুর ডাল', price: 142, unit: 'কেজি', change: 2.9, up: true },
    { id: 5, emoji: '🫘', name: 'ছোলা', price: 120, unit: 'কেজি', change: 2.8, up: false },
    { id: 6, emoji: '🫘', name: 'আমন ডাল', price: 95, unit: 'কেজি', change: 1.4, up: true },
];

const toBn = (n) => Number(n).toLocaleString('bn-BD');

function TickerItem({ item }) {
    return (
        <div className="flex shrink-0 items-center gap-2 px-6 text-sm text-gray-800">
            <span aria-hidden="true">{item.emoji}</span>
            <span className="font-medium">{item.name}</span>
            <span className="text-gray-700">
                {toBn(item.price)} টাকা/{item.unit}
            </span>
            <span
                className={`flex items-center gap-0.5 text-xs font-semibold ${
                    item.up ? 'text-red-600' : 'text-green-600'
                }`}
            >
                {item.up ? '▲' : '▼'} {toBn(item.change)}%
            </span>
        </div>
    );
}

export default function PriceTicker({ items = sampleItems }) {
    return (
        <div className="ticker overflow-hidden border-y border-gray-200 bg-[#f6f9f6] py-2.5">
            {}
            <div className="ticker-track">
                {[...items, ...items].map((item, i) => (
                    <TickerItem key={`${item.id}-${i}`} item={item} />
                ))}
            </div>
        </div>
    );
}