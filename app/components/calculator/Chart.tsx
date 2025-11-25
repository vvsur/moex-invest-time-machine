"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Dot,
} from "recharts";

interface Candle {
    date: string; // ISO
    close: number;
}

interface ChartProps {
    data: Candle[];
    buyDate: string;
    sellDate: string;
}

export function Chart({ data, buyDate, sellDate }: ChartProps) {
    const formatted = data.map((d) => ({
        date: d.date,
        close: d.close,
    }));

    // =============================
    // 🚦 Определяем направление тренда
    // =============================
    const first = formatted[0]?.close ?? 0;
    const last = formatted.at(-1)?.close ?? 0;
    const isUp = last >= first;

    // =============================
    // 🎨 Цвета в зависимости от доходности
    // =============================
    const strokeColor = isUp ? "#0A7B0A" : "#E31E24";
    const fillColor = isUp
        ? "rgba(10, 123, 10, 0.25)"    // зелёный прозрачный
        : "rgba(227, 30, 36, 0.25)";  // красный прозрачный

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
                График цены
            </h2>

            <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formatted}>

                        {/* X axis */}
                        <XAxis
                            dataKey="date"
                            fontSize={12}
                            tickMargin={8}
                        />

                        {/* Y axis (right) */}
                        <YAxis
                            fontSize={12}
                            domain={["auto", "auto"]}
                            orientation="right"
                        />

                        <Tooltip contentStyle={{ fontSize: "12px" }} />

                        {/* ====== AREA (с динамическими цветами) ====== */}
                        <Area
                            type="linear"
                            dataKey="close"
                            stroke={strokeColor}
                            strokeWidth={2}
                            fill={fillColor}
                            dot={{
                                r: 3,
                                stroke: strokeColor,
                                strokeWidth: 1,
                                fill: "#ffffff",
                            }}
                        />

                        {/* ===== SELL LINE ===== */}
                        {sellDate && (
                            <>
                                <ReferenceLine
                                    x={sellDate}
                                    stroke="#E31E24"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                />

                                <Dot
                                    cx={0}
                                    cy={0}
                                    r={6}
                                    fill="#E31E24"
                                    stroke="#ffffff"
                                    strokeWidth={2}
                                    isActive
                                    payload={{
                                        date: sellDate,
                                        close: formatted.at(-1)?.close,
                                    }}
                                />
                            </>
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
