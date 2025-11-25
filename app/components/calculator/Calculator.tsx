"use client";

import { useState, useEffect } from "react";
import { TickerSelector } from "./TickerSelector";
import { DateSelector } from "./DateSelector";
import { Inputs } from "./Inputs";
import { Result } from "./Result";
import { Chart } from "./Chart";

import { CalcResult } from "./types/CalcResult";
import { fetchHistory } from "@/app/lib/moex/fetchHistory";
import { calculateReturn } from "@/app/lib/moex/calculateReturn";
import { Toast } from "./ui/Toast";

export function Calculator() {
    const [ticker, setTicker] = useState<string>("");
    const [buyDate, setBuyDate] = useState<string>("");
    const [sellDate, setSellDate] = useState<string>("");
    const [amount, setAmount] = useState<number>(10000);
    const [result, setResult] = useState<CalcResult | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const showError = (msg: string) => setToast(msg);

    // ==============================
    // 🗓 Проставляем даты автоматически
    // ==============================
    useEffect(() => {
        const now = new Date();
        const sell = new Date(now);
        sell.setDate(sell.getDate() - 1);

        const buy = new Date(sell);
        buy.setMonth(buy.getMonth() - 1);

        const iso = (d: Date) => d.toISOString().split("T")[0];
        setSellDate(iso(sell));
        setBuyDate(iso(buy));
    }, []);

    // ==============================
    // 📈 Расчёт доходности
    // ==============================
    const handleCalculate = async () => {
        if (!ticker || !buyDate || !sellDate) {
            showError("Выберите инструмент и укажите даты");
            return;
        }

        const candles = await fetchHistory(ticker, buyDate, sellDate);

        if (!candles || candles.length === 0) {
            showError("Данные за выбранный период отсутствуют");
            return;
        }

        const resultData = calculateReturn(
            ticker,
            buyDate,
            sellDate,
            amount,
            candles
        );

        setResult(resultData);
    };

    // ==============================
    // UI
    // ==============================
    return (
        <div className="relative max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">

            {/* Popup уведомление */}
            {toast && (
                <Toast
                    message={toast}
                    type="error"
                    onClose={() => setToast(null)}
                />
            )}

            <h1 className="text-2xl font-semibold mb-6 text-[#E31E24]">
                MOEX Invest Time Machine
            </h1>

            {/* Тикер */}
            <div className="mb-6">
                <TickerSelector value={ticker} onChange={setTicker} />
            </div>

            {/* Даты */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <DateSelector
                    label="Дата покупки"
                    value={buyDate}
                    onChange={setBuyDate}
                />
                <DateSelector
                    label="Дата продажи"
                    value={sellDate}
                    onChange={setSellDate}
                />
            </div>

            {/* Сумма */}
            <div className="mb-6">
                <Inputs amount={amount} onChangeAmount={setAmount} />
            </div>

            <button
                onClick={handleCalculate}
                className="w-full bg-[#E31E24] hover:bg-red-700 text-white py-3 rounded-md transition font-medium"
            >
                Рассчитать доходность
            </button>

            {/* Результат */}
            {result && (
                <>
                    <div className="mt-6">
                        <Result data={result} />
                    </div>

                    {/* === График === */}
                    <div className="mt-8">
                        <Chart
                            data={result.history}
                            buyDate={buyDate}
                            sellDate={sellDate}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
