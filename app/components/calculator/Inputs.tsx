"use client";

interface InputsProps {
    amount: number;
    onChangeAmount: (v: number) => void;
}

export function Inputs({ amount, onChangeAmount }: InputsProps) {
    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
                Сумма инвестиций (₽)
            </label>

            <input
                type="number"
                min={0}
                step={100}
                value={amount}
                onChange={(e) => onChangeAmount(Number(e.target.value))}
                className="
          px-4 py-2 border border-gray-300 rounded-md
          bg-white text-gray-900
          focus:outline-none focus:ring-2 focus:ring-[#E31E24]
          placeholder-gray-400
        "
                placeholder="Например: 10000"
            />
        </div>
    );
}
