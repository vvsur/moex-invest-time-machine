export interface CalcHistoryCandle {
    date: string;
    close: number;
}

export interface CalcTransaction {
    date: string;
    amount: number;
    price: number;
    shares: number;
}

export interface PortfolioPoint {
    date: string;
    value: number; // стоимость портфеля на эту дату
}

export interface CalcResult {
    buyDate: string;
    sellDate: string;

    buyPrice: number;
    sellPrice: number;

    profit: number;
    profitPercent: number;
    finalAmount: number;

    irr: number | null;
    cagr: number | null;

    totalInvested: number;

    history: CalcHistoryCandle[];

    transactions: CalcTransaction[];

    /** 📈 История стоимости портфеля по дням */
    portfolioHistory: PortfolioPoint[];
}
