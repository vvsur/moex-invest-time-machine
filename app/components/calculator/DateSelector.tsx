"use client";

interface DateSelectorProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
}

export function DateSelector({ label, value, onChange }: DateSelectorProps) {
    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>

            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="
                    px-4 py-2 border border-gray-300 rounded-md
                    bg-white text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-[#E31E24]
                "
            />
        </div>
    );
}
