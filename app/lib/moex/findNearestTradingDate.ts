export function findNearestTradingDate(
    candles: { date: string }[],
    target: string
): string {
    // Если в истории есть точное совпадение — возвращаем
    if (candles.some(c => c.date === target)) {
        return target;
    }

    // Ищем ближайшую дату позже target
    const later = candles.find(c => c.date > target);
    if (later) return later.date;

    // Если нет, используем последнюю доступную (на случай плохого диапазона)
    return candles[candles.length - 1].date;
}
