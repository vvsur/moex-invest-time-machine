import { Candle } from "@/app/components/calculator/types/Candle";
import {
    CalcResult,
    CalcTransaction,
    PortfolioPoint,
} from "@/app/components/calculator/types/CalcResult";
import { findNearestTradingDate } from "@/app/lib/moex/findNearestTradingDate";

/**
 * XIRR через метод Ньютона
 */
function xirr(cashflows: { date: Date; amount: number }[], guess = 0.1): number {
    const MAX_IT = 100;
    const EPS = 1e-7;

    const xnpv = (rate: number) => {
        const t0 = cashflows[0].date.getTime();
        return cashflows.reduce((sum, cf) => {
            const dt = (cf.date.getTime() - t0) / (365 * 24 * 3600 * 1000);
            return sum + cf.amount / Math.pow(1 + rate, dt);
        }, 0);
    };

    let rate = guess;

    for (let i = 0; i < MAX_IT; i++) {
        const f = xnpv(rate);

        const df = (() => {
            const t0 = cashflows[0].date.getTime();
            return cashflows.reduce((sum, cf) => {
                const dt = (cf.date.getTime() - t0) / (365 * 24 * 3600 * 1000);
                return sum - (dt * cf.amount) / Math.pow(1 + rate, dt + 1);
            }, 0);
        })();

        const newRate = rate - f / df;
        if (Math.abs(newRate - rate) < EPS) return newRate;

        rate = newRate;
    }

    return rate;
}

/**
 * Главный расчёт доходности
 */
export function calculateReturn(
    ticker: string,
    buyDate: string,
    sellDate: string,
    amount: number,
    {
        contributionAmount,
        contributionPeriod,
    }: {
        contributionAmount: number;
        contributionPeriod: "none" | "monthly" | "quarterly" | "yearly";
    },
    candles: Candle[],
): CalcResult {
    if (candles.length === 0) {
        throw new Error("Нет данных по истории цены");
    }

    // === Торговые даты
    const realBuyDate = findNearestTradingDate(candles, buyDate);
    const realSellDate = findNearestTradingDate(candles, sellDate);

    const buyC = candles.find((c) => c.date === realBuyDate)!;
    const sellC = candles.find((c) => c.date === realSellDate)!;

    const buyPrice = buyC.close;
    const sellPrice = sellC.close;

    // === Лог всех покупок
    const transactions: CalcTransaction[] = [];

    let totalShares = amount / buyPrice;
    let totalInvested = amount;

    // первая покупка
    transactions.push({
        date: realBuyDate,
        price: buyPrice,
        amount,
        shares: totalShares,
    });

    // === Регулярные взносы
    if (contributionPeriod !== "none" && contributionAmount > 0) {
        let cursor = new Date(realBuyDate);
        const end = new Date(realSellDate);

        const addPeriod = () => {
            if (contributionPeriod === "monthly") cursor.setMonth(cursor.getMonth() + 1);
            if (contributionPeriod === "quarterly") cursor.setMonth(cursor.getMonth() + 3);
            if (contributionPeriod === "yearly") cursor.setFullYear(cursor.getFullYear() + 1);
        };

        addPeriod();

        while (cursor <= end) {
            const iso = cursor.toISOString().split("T")[0];
            const realDate = findNearestTradingDate(candles, iso);
            const cndl = candles.find((c) => c.date === realDate);

            if (cndl) {
                const sharesBought = contributionAmount / cndl.close;
                totalShares += sharesBought;
                totalInvested += contributionAmount;

                transactions.push({
                    date: realDate,
                    price: cndl.close,
                    amount: contributionAmount,
                    shares: sharesBought,
                });
            }

            addPeriod();
        }
    }

    // === Итоговая стоимость
    const finalAmount = totalShares * sellPrice;
    const profit = finalAmount - totalInvested;
    const profitPercent = (profit / totalInvested) * 100;

    // === XIRR: фикс → исключаем первую покупку из дубля
    const cashflows = [
        { date: new Date(realBuyDate), amount: -amount }, // первая покупка

        // регулярные взносы (если есть)
        ...transactions
            .slice(1) // исключение первой покупки
            .map((t) => ({
                date: new Date(t.date),
                amount: -t.amount,
            })),

        // финальная продажа
        { date: new Date(realSellDate), amount: finalAmount },
    ];

    let irr: number | null = null;
    try {
        if (cashflows.length > 2) {
            irr = xirr(cashflows) * 100;
        }
    } catch { }

    // === CAGR
    const years =
        (new Date(realSellDate).getTime() - new Date(realBuyDate).getTime()) /
        (365 * 24 * 3600 * 1000);

    const cagr =
        years > 0.5 ? (Math.pow(finalAmount / totalInvested, 1 / years) - 1) * 100 : null;

    // === История портфеля
    let runningShares = 0;

    const portfolioHistory: PortfolioPoint[] = candles.map((c) => {
        transactions
            .filter((t) => t.date === c.date)
            .forEach((t) => {
                runningShares += t.shares;
            });

        return {
            date: c.date,
            value: runningShares * c.close,
        };
    });

    return {
        buyDate: realBuyDate,
        sellDate: realSellDate,
        buyPrice,
        sellPrice,

        profit: Number(profit.toFixed(2)),
        profitPercent: Number(profitPercent.toFixed(2)),
        finalAmount: Number(finalAmount.toFixed(2)),

        irr: irr !== null ? Number(irr.toFixed(2)) : null,
        cagr: cagr !== null ? Number(cagr.toFixed(2)) : null,

        totalInvested: Number(totalInvested.toFixed(2)),
        history: candles,

        transactions,
        portfolioHistory,
    };
}
