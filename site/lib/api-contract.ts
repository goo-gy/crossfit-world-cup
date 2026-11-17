import type { Game } from './tournament';

export type StatsRow = {
  id: string;
  appearances: number;
  battles: number;
  wins: number;
  champions: number;
};
export type Stats = { total: number; rows: StatsRow[] };

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}
function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

export function parseGameSize(value: unknown): 16 | 32 {
  if (!isRecord(value) || (value.size !== 16 && value.size !== 32)) {
    throw new Error('16강 또는 32강을 선택해주세요.');
  }
  return value.size;
}

export function parseCompletion(value: unknown): { id: string; choices: string[] } {
  if (!isRecord(value) || typeof value.id !== 'string' || !value.id ||
      !isStringArray(value.choices) || value.choices.length > 31) {
    throw new Error('잘못된 결과입니다.');
  }
  return { id: value.id, choices: value.choices };
}

export function parseGame(value: unknown): Game {
  if (!isRecord(value) || typeof value.id !== 'string' || !value.id ||
      !isStringArray(value.pool) || ![16, 32].includes(value.pool.length) ||
      new Set(value.pool).size !== value.pool.length || !isStringArray(value.choices) ||
      value.choices.length > value.pool.length - 1) {
    throw new Error('게임 응답 형식이 올바르지 않습니다.');
  }
  return { id: value.id, pool: value.pool, choices: value.choices };
}

function isStatsRow(value: unknown): value is StatsRow {
  return isRecord(value) && typeof value.id === 'string' &&
    isCount(value.appearances) && value.appearances > 0 &&
    isCount(value.battles) && isCount(value.wins) && isCount(value.champions) &&
    value.wins <= value.battles && value.champions <= value.appearances;
}
export function parseStats(value: unknown): Stats {
  if (!isRecord(value) || !isCount(value.total) || !Array.isArray(value.rows) ||
      !value.rows.every(isStatsRow)) {
    throw new Error('통계 응답 형식이 올바르지 않습니다.');
  }
  return { total: value.total, rows: value.rows };
}

export function parseCompletedGame(value: unknown): { winner: string } {
  if (!isRecord(value) || typeof value.winner !== 'string') {
    throw new Error('결과 저장 응답 형식이 올바르지 않습니다.');
  }
  return { winner: value.winner };
}

export function apiErrorMessage(value: unknown): string {
  return isRecord(value) && typeof value.error === 'string' && value.error
    ? value.error : '연결을 확인해주세요.';
}
