import { Candle } from "@/app/components/calculator/types/Candle";
import { normalizeHistory } from "./normalizeHistory";


export async function fetchHistory(
    ticker: string,
    from: string,
    to: string
): Promise<Candle[]> {

    // 1. Определяем доску (market board)
    let url = "";

    if (ticker === "IMOEX") {
        // Индекс
        url = `https://iss.moex.com/iss/history/engines/stock/markets/index/boards/SNDX/securities/IMOEX.json?from=${from}&till=${to}`;
    } else {
        // Акции TQBR
        url = `https://iss.moex.com/iss/history/engines/stock/markets/shares/boards/TQBR/securities/${ticker}.json?from=${from}&till=${to}`;
    }

    // 2. Загружаем ISS
    const res = await fetch(url);
    const json = await res.json();

    // 3. Нормализуем
    return normalizeHistory(json);
}
