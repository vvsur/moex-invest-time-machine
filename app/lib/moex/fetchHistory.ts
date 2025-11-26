import { Candle } from "@/app/components/calculator/types/Candle";
import { normalizeHistory } from "./normalizeHistory";

export async function fetchHistory(
    ticker: string,
    from: string,
    to: string
): Promise<Candle[]> {

    // console.log("📌 fetchHistory START", { ticker, from, to });

    const baseUrl =
        ticker === "IMOEX"
            ? `https://iss.moex.com/iss/history/engines/stock/markets/index/boards/SNDX/securities/IMOEX.json`
            : `https://iss.moex.com/iss/history/engines/stock/markets/shares/boards/TQBR/securities/${ticker}.json`;

    let allRows: any[] = [];
    let start = 0;
    let page = 1;

    while (true) {
        const url = `${baseUrl}?from=${from}&till=${to}&start=${start}`;
        // console.log(`📡 Request page ${page}:`, url);

        const res = await fetch(url);
        const json = await res.json();

        const history = json.history;
        if (!history) break;

        const rows = history.data || [];
        // console.log(`📄 Page ${page}: rows=${rows.length}`);

        allRows.push(...rows);

        const cursor = json["history.cursor"]?.data?.[0];
        if (!cursor) break;

        const [index, total, pageSize] = cursor;
        if (index + pageSize >= total) break;

        start += pageSize;
        page++;
        await new Promise((r) => setTimeout(r, 50));
    }

    // console.log("📦 Total rows:", allRows.length);

    // ========= ДИНАМИЧЕСКИЕ ИНДЕКСЫ (корректные) =========
    const isIndex = ticker === "IMOEX";

    const TRADEDATE_INDEX = isIndex ? 2 : 1;
    const CLOSE_INDEX = isIndex ? 8 : 11;

    // console.log("🔎 Using indexes:", { TRADEDATE_INDEX, CLOSE_INDEX });

    return normalizeHistory({
        history: {
            columns: ["TRADEDATE", "CLOSE"],
            data: allRows.map(row => [
                row[TRADEDATE_INDEX],
                row[CLOSE_INDEX]
            ])
        }
    });
}
