
import { Candle } from "@/app/components/calculator/types/Candle";
import { findNearestTradingDate } from "./findNearestTradingDate";
import { CalcResult } from "@/app/components/calculator/types/CalcResult";

export function calculateReturn(
    ticker: string,
    buyDate: string,
    sellDate: string,
    amount: number,
    candles: Candle[]
): CalcResult {

    if (candles.length === 0) {
        throw new Error("Нет данных по истории цены");
    }

    // === 1. Находим доступные торговые даты ===
    const realBuyDate = findNearestTradingDate(candles, buyDate);
    const realSellDate = findNearestTradingDate(candles, sellDate);

    // === 2. Находим цены ===
    const buyCandle = candles.find((c) => c.date === realBuyDate);
    const sellCandle = candles.find((c) => c.date === realSellDate);

    if (!buyCandle) throw new Error(`Нет цены на дату покупки ${realBuyDate}`);
    if (!sellCandle) throw new Error(`Нет цены на дату продажи ${realSellDate}`);

    const buyPrice = buyCandle.close;
    const sellPrice = sellCandle.close;

    // === 3. Расчёт доходности ===
    const shares = amount / buyPrice; // сколько бумаг купили
    const finalAmount = shares * sellPrice;

    const profit = finalAmount - amount;
    const profitPercent = (profit / amount) * 100;

    return {
        buyDate: realBuyDate,
        sellDate: realSellDate,
        buyPrice,
        sellPrice,
        profit: Number(profit.toFixed(2)),
        profitPercent: Number(profitPercent.toFixed(2)),
        finalAmount: Number(finalAmount.toFixed(2)),
        history: candles,
    };
}
