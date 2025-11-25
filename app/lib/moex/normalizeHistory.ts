import { Candle } from "@/app/components/calculator/types/Candle";


export function normalizeHistory(raw: any): Candle[] {
    const rows = raw.history.data;
    const cols = raw.history.columns;

    const idxDate = cols.indexOf("TRADEDATE");
    const idxClose = cols.indexOf("CLOSE");

    return rows
        .map((row: any[]) => ({
            date: row[idxDate],
            close: Number(row[idxClose]),
        }))
        .filter((candle: { close: number; }) => candle.close > 0); // ISS иногда отдаёт пустые нули
}
