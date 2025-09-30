// app/lib/normalizeLogs.ts
export type LogEntry = { time: string; message: string; meta?: any };

/**
 * Пытаемся корректно извлечь массив логов из поля unit.logs (которое у тебя Json в Prisma).
 * Поддерживает: null, [] , stringified JSON, [{...}, ...], а также простые строки.
 */
function normalizeEntry(e: any): LogEntry {
  if (!e) {
    return { time: new Date().toISOString(), message: "" };
  }
  if (typeof e === "string") {
    // пытаемся распарсить JSON-строку
    try {
      const p = JSON.parse(e);
      if (p && typeof p === "object" && ("time" in p || "message" in p)) {
        return {
          time: p.time ?? p.createdAt ?? new Date().toISOString(),
          message: p.message ?? JSON.stringify(p),
          meta: p.meta ?? undefined,
        };
      }
    } catch {
      // обычная строка — используем как message
      return { time: new Date().toISOString(), message: e };
    }
    return { time: new Date().toISOString(), message: e };
  }

  if (typeof e === "object") {
    return {
      time: e.time ?? e.createdAt ?? e.created_at ?? new Date().toISOString(),
      message: e.message ?? e.msg ?? e.text ?? JSON.stringify(e),
      meta: e.meta ?? e.data ?? undefined,
    };
  }

  // fallback
  return { time: new Date().toISOString(), message: String(e) };
}

export function parseUnitLogs(raw: any): LogEntry[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(normalizeEntry);
  if (typeof raw === "string") {
    // возможно JSON array as string
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(normalizeEntry);
      return [normalizeEntry(parsed)];
    } catch {
      return [normalizeEntry(raw)];
    }
  }
  if (typeof raw === "object") {
    // возможно объект с field "entries"
    if (Array.isArray((raw as any).entries)) {
      return (raw as any).entries.map(normalizeEntry);
    }
    return [normalizeEntry(raw)];
  }
  return [];
}

/**
 * Собирает логи со всех productUnits, аннотирует их серийным номером (если есть)
 * и сортирует по времени (новые — первыми).
 */
export function normalizeLogs(units: any[] | undefined): LogEntry[] {
  const all: LogEntry[] = [];
  (units || []).forEach((u) => {
    const unitLogs = parseUnitLogs(u.logs);
    const serial = u?.serialNumber ? `[${u.serialNumber}] ` : "";
    unitLogs.forEach((l) => all.push({ ...l, message: `${serial}${l.message}` }));
  });

  all.sort((a, b) => {
    const ta = new Date(a.time).getTime() || 0;
    const tb = new Date(b.time).getTime() || 0;
    return tb - ta;
  });

  return all;
}
