"use client";

interface InputsProps {
    amount: number;
    contributionAmount: number;
    contributionPeriod: "monthly" | "quarterly" | "yearly";
    onChangeAmount: (v: number) => void;
    onChangeContributionAmount: (v: number) => void;
    onChangeContributionPeriod: (v: "monthly" | "quarterly" | "yearly") => void;
}

/* ------------------------------------------
   Format helpers
------------------------------------------- */

const formatNumber = (value?: number) => {
    if (typeof value !== "number" || isNaN(value)) return "";
    return value.toLocaleString("ru-RU");
};

const parseNumber = (value: string) => {
    const n = Number(value.replace(/\s+/g, ""));
    return isNaN(n) ? 0 : n;
};

/* ------------------------------------------
   Component
------------------------------------------- */

export function Inputs({
    amount,
    contributionAmount,
    contributionPeriod,
    onChangeAmount,
    onChangeContributionAmount,
    onChangeContributionPeriod
}: InputsProps) {

    const displayAmount = amount === 0 ? "" : formatNumber(amount);
    const displayContribution =
        contributionAmount === 0 ? "" : formatNumber(contributionAmount);

    return (
        <div className="flex flex-col gap-6">

            {/* === Основная сумма инвестиций === */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                    Сумма начальных инвестиций (₽)
                </label>

                <input
                    type="text"
                    inputMode="numeric"
                    value={displayAmount}
                    onChange={(e) => {
                        const raw = e.target.value;
                        if (raw.trim() === "") return onChangeAmount(0);

                        const num = parseNumber(raw);
                        onChangeAmount(num);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md
                               bg-white text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
                    placeholder="100 000"
                />
            </div>

            {/* === Регулярность + Сумма доп. взноса (в 1 строке) === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Регулярность */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                        Регулярность доп. взноса
                    </label>

                    <select
                        value={contributionPeriod}
                        onChange={(e) =>
                            onChangeContributionPeriod(
                                e.target.value as "monthly" | "quarterly" | "yearly"
                            )
                        }
                        className="px-4 py-2 border border-gray-300 rounded-md
                                   bg-white text-gray-900
                                   focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
                    >
                        <option value="monthly">Каждый месяц</option>
                        <option value="quarterly">Каждый квартал</option>
                        <option value="yearly">Каждый год</option>
                    </select>
                </div>

                {/* Сумма доп. взноса */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                        Сумма регулярного взноса (₽)
                    </label>

                    <input
                        type="text"
                        inputMode="numeric"
                        value={displayContribution}
                        onChange={(e) => {
                            const raw = e.target.value;

                            if (raw.trim() === "") {
                                onChangeContributionAmount(0);
                                return;
                            }

                            const num = parseNumber(raw);
                            onChangeContributionAmount(num);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md
                                   bg-white text-gray-900
                                   focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
                        placeholder="10 000"
                    />
                </div>
            </div>
        </div>
    );
}
