export interface CalcHistoryCandle {
    date: string;
    close: number;
}

export interface CalcResult {
    buyDate: string;
    sellDate: string;
    buyPrice: number;
    sellPrice: number;
    profit: number;
    profitPercent: number;
    finalAmount: number;
    history: CalcHistoryCandle[];
}
