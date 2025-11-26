export function findNearestTradingDate(
    candles: { date: string }[],
    target: string
): string {
    // Страхуемся от некорректного порядка
    const sorted = [...candles].sort((a, b) => a.date.localeCompare(b.date));

    // 1. Точное совпадение
    if (sorted.some(c => c.date === target)) {
        return target;
    }

    // 2. Ищем ближайшую дату позже
    const later = sorted.find(c => c.date > target);
    if (later) return later.date;

    // 3. Если поздней нет → последняя доступная
    return sorted[sorted.length - 1].date;
}
