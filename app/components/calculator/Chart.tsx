"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Customized
} from "recharts";

interface Candle {
    date: string;
    close: number;
}

interface ChartProps {
    data: Candle[];
    buyDate: string;
    sellDate: string;
}

// ===============================
// ⭐ Компонент BUY/SELL точек
// ===============================
function CustomPoints(props: any) {
    const { formatted, buyDate, sellDate } = props;
    const xAxis = props.xAxisMap?.[0];
    const yAxis = props.yAxisMap?.[0];

    if (!xAxis || !yAxis) return null;

    const scaleX = xAxis.scale;
    const scaleY = yAxis.scale;

    const out: React.ReactNode[] = [];

    // BUY point
    if (buyDate) {
        const item = formatted.find((x: { date: any; }) => x.date === buyDate);
        if (item) {
            out.push(
                <circle
                    key="buy"
                    cx={scaleX(item.date)}
                    cy={scaleY(item.close)}
                    r={6}
                    fill="#0A7B0A"
                    stroke="#ffffff"
                    strokeWidth={2}
                />
            );
        }
    }

    // SELL point
    if (sellDate) {
        const item = formatted.find((x: { date: any; }) => x.date === sellDate);
        if (item) {
            out.push(
                <circle
                    key="sell"
                    cx={scaleX(item.date)}
                    cy={scaleY(item.close)}
                    r={6}
                    fill="#E31E24"
                    stroke="#ffffff"
                    strokeWidth={2}
                />
            );
        }
    }

    return <g>{out}</g>;
}

// ===============================
// 📈 Основной график
// ===============================
export function Chart({ data, buyDate, sellDate }: ChartProps) {
    const formatted = data.map((d) => ({
        date: d.date,
        close: d.close,
    }));

    const first = formatted[0]?.close ?? 0;
    const last = formatted.at(-1)?.close ?? 0;
    const isUp = last >= first;

    const strokeColor = isUp ? "#0A7B0A" : "#E31E24";
    const fillColor = isUp
        ? "rgba(10, 123, 10, 0.25)"
        : "rgba(227, 30, 36, 0.25)";

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
                График цены
            </h2>

            <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formatted}>
                        <XAxis dataKey="date" fontSize={12} tickMargin={8} />

                        <YAxis
                            fontSize={12}
                            domain={["auto", "auto"]}
                            orientation="right"
                        />

                        <Tooltip contentStyle={{ fontSize: "12px" }} />

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
                                fill: "#ffffff"
                            }}
                        />

                        {sellDate && (
                            <ReferenceLine
                                x={sellDate}
                                stroke="#E31E24"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                            />
                        )}

                        <Customized
                            component={(props: any) => (
                                <CustomPoints
                                    {...props}
                                    formatted={formatted}
                                    buyDate={buyDate}
                                    sellDate={sellDate}
                                />
                            )}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
