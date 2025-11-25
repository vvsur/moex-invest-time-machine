"use client";

interface InputsProps {
    amount: number;
    onChangeAmount: (v: number) => void;
}

// Форматируем число в стиль "100 000"
const formatNumber = (value: number) => {
    return value.toLocaleString("ru-RU");
};

// Убираем пробелы для стейта
const parseNumber = (value: string) => {
    return Number(value.replace(/\s+/g, ""));
};

export function Inputs({ amount, onChangeAmount }: InputsProps) {
    // amount === 0 → показываем пустую строку
    const displayValue = amount === 0 ? "" : formatNumber(amount);

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
                Сумма инвестиций (₽)
            </label>

            <input
                type="text" // Важно! чтобы пробелы работали
                inputMode="numeric"
                value={displayValue}
                onChange={(e) => {
                    const raw = e.target.value;

                    // Если пользователь стер всё
                    if (raw.trim() === "") {
                        onChangeAmount(0);
                        return;
                    }

                    // Убираем пробелы → получаем чистое число
                    const num = parseNumber(raw);

                    if (!isNaN(num)) {
                        onChangeAmount(num);
                    }
                }}
                className="
                    px-4 py-2 border border-gray-300 rounded-md
                    bg-white text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-[#E31E24]
                    placeholder-gray-400
                "
                placeholder="Например: 100 000"
            />
        </div>
    );
}
