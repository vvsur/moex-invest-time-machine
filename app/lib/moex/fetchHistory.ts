import { Candle } from "@/app/components/calculator/types/Candle";
import { normalizeHistory } from "./normalizeHistory";

/**
 * Универсальная функция извлечения цены закрытия из разных форматов MOEX
 */
function extractClose(columns: string[], row: any[]): number | null {
    const map = Object.fromEntries(columns.map((c, i) => [c, row[i]]));

    return (
        map.CLOSE ??
        map.LEGALCLOSEPRICE ??
        map.LASTPRICE ??
        map.MARKETPRICE ??
        map.MARKETPRICE2 ??
        map.MARKETPRICE3 ??
        map.WAPRICE ??
        null
    );
}

/**
 * Универсальная функция извлечения даты из разных форматов MOEX
 */
function extractDate(columns: string[], row: any[]): string | null {
    const map = Object.fromEntries(columns.map((c, i) => [c, row[i]]));

    return (
        map.TRADEDATE ??
        map.TRADE_SESSION_DATE ??
        null
    );
}

export async function fetchHistory(
    ticker: string,
    from: string,
    to: string
): Promise<Candle[]> {

    const baseUrl =
        ticker === "IMOEX"
            ? `https://iss.moex.com/iss/history/engines/stock/markets/index/boards/SNDX/securities/IMOEX.json`
            : `https://iss.moex.com/iss/history/engines/stock/markets/shares/boards/TQBR/securities/${ticker}.json`;

    let allRows: any[] = [];
    let allColumns: string[] | null = null;

    let start = 0;
    let page = 1;

    while (true) {
        const url = `${baseUrl}?from=${from}&till=${to}&start=${start}`;
        console.log(`📡 MOEX Page ${page}:`, url);

        const res = await fetch(url);
        const json = await res.json();

        if (!json.history) break;

        // сохраняем колонки первой страницы
        if (!allColumns) {
            allColumns = json.history.columns;
        }

        const rows = json.history.data || [];
        allRows.push(...rows);

        // пагинация
        const cursor = json["history.cursor"]?.data?.[0];
        if (!cursor) break;

        const [index, total, pageSize] = cursor;
        if (index + pageSize >= total) break;

        start += pageSize;
        page++;
        await new Promise(r => setTimeout(r, 50));
    }

    if (!allColumns) {
        console.warn("⚠ history.columns отсутствуют");
        return [];
    }

    console.log("📊 MOEX format detected:", allColumns.slice(0, 10), "...");

    // теперь полностью универсальный парсер
    const normalizedRows = allRows
        .map(row => {
            const date = extractDate(allColumns!, row);
            const close = extractClose(allColumns!, row);

            if (!date || !close) return null;

            return [date, close];
        })
        .filter(Boolean);

    return normalizeHistory({
        history: {
            columns: ["TRADEDATE", "CLOSE"],
            data: normalizedRows as [string, number][],
        }
    });
}
