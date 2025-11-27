"use client";

import { useEffect, useState, useRef } from "react";

interface Security {
    ticker: string;
    name: string;
    type: string;
}

interface TickerSelectorProps {
    value: string;
    onChange: (v: string) => void;
}

export function TickerSelector({ value, onChange }: TickerSelectorProps) {
    const [suggestions, setSuggestions] = useState<Security[]>([]);
    const [query, setQuery] = useState(value ?? "");
    const [open, setOpen] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchSuggestions = async (q: string) => {
        if (q.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const url = `https://iss.moex.com/iss/securities.json?q=${encodeURIComponent(q)}&iss.meta=off`;
            console.log("📡 FETCH:", url);
            const res = await fetch(url);
            // console.log("📥 Status:", res.status);
            const json = await res.json();

            const rows = json.securities?.data ?? [];
            const cols = json.securities?.columns ?? [];

            const idxSecId = cols.indexOf("secid");
            const idxName = cols.indexOf("name");
            const idxType = cols.indexOf("type");

            const normalized: Security[] = rows
                .map((row: any[]): Security | null => {
                    const ticker = row[idxSecId];
                    if (!ticker) return null;
                    return {
                        ticker,
                        name: row[idxName] || "",
                        type: row[idxType] || "unknown",
                    };
                })
                .filter(Boolean) as Security[];

            // console.log("✅ Suggestions:", normalized.slice(0, 10));
            setSuggestions(normalized);
        } catch (e) {
            // console.error("❌ Ошибка fetchSuggestions:", e);
        }
    };

    useEffect(() => {
        // debounce input
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            fetchSuggestions(query);
        }, 300);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [query]);

    const handleSelect = (ticker: string) => {
        onChange(ticker);
        setQuery(ticker);
        setOpen(false);
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Инструмент (тикер)
            </label>
            <input
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                placeholder="Например: SBER, GAZP, IMOEX..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E31E24]"
            />
            {open && suggestions.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-auto">
                    {suggestions.slice(0, 20).map((sec) => (
                        <div
                            key={sec.ticker}
                            onClick={() => handleSelect(sec.ticker)}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex flex-col border-b border-gray-100"
                        >
                            <span className="text-sm font-medium text-gray-900">{sec.ticker}</span>
                            <span className="text-xs text-gray-600">{sec.name}</span>
                            <span className="text-[10px] text-gray-500 uppercase mt-1">{sec.type}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
