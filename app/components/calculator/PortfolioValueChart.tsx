"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface Point {
    date: string;
    value: number;
}

export function PortfolioValueChart({ history }: { history: Point[] }) {
    if (!history || history.length < 2) return null;

    const startValue = history[0].value;
    const endValue = history[history.length - 1].value;

    // 🔥 Цвет линии по прибыли/убытку
    const lineColor = endValue < startValue ? "#E31E24" : "#0A7B0A";

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
                Стоимость портфеля во времени
            </h2>

            <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history}>

                        {/* Ось X */}
                        <XAxis dataKey="date" fontSize={12} />

                        {/* Ось Y — теперь справа */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            fontSize={12}
                            domain={["auto", "auto"]}
                        />

                        {/* Tooltip (можно оставить поверх графика) */}
                        <Tooltip
                            formatter={(v: number) =>
                                v.toLocaleString("ru-RU", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }) + " ₽"
                            }
                        />

                        {/* Линия портфеля */}
                        <Line
                            type="linear"
                            yAxisId="right"
                            dataKey="value"
                            stroke={lineColor}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
