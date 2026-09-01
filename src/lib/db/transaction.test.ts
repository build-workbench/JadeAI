
import { sql } from 'drizzle-orm';

import { PostgreSQLAdapter } from './adapters/postgresql';
import { SQLiteAdapter } from './adapters/sqlite';
import { test, expect } from 'vitest';

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replaceAll('"', '""')}"`;
}

test('SQLite transaction rolls back when callback throws', async () => {
  const adapter = new SQLiteAdapter(':memory:');

  try {
    adapter.db.run(sql`CREATE TABLE __transaction_probe (id text PRIMARY KEY)`);

    await adapter.transaction((tx) => {
      tx.run(sql`INSERT INTO __transaction_probe (id) VALUES ('committed')`);
    });

    await expect(adapter.transaction((tx) => {
        tx.run(sql`INSERT INTO __transaction_probe (id) VALUES ('rolled-back')`);
        throw new Error('force rollback');
      })).rejects.toThrow(/force rollback/);

    const row = adapter.db.get(sql`SELECT count(*) AS count FROM __transaction_probe`) as { count: number };
    expect(Number(row.count)).toBe(1);
  } finally {
    await adapter.close();
  }
});

test('SQLite transaction seam rejects async callbacks before commit', async () => {
  const adapter = new SQLiteAdapter(':memory:');

  try {
    adapter.db.run(sql`CREATE TABLE __transaction_probe (id text PRIMARY KEY)`);

    await expect(
      adapter.transaction(async (tx) => {
        tx.run(sql`INSERT INTO __transaction_probe (id) VALUES ('rolled-back')`);
      })).rejects.toThrow(/SQLite transactions require synchronous callbacks/);

    const row = adapter.db.get(sql`SELECT count(*) AS count FROM __transaction_probe`) as { count: number };
    expect(Number(row.count)).toBe(0);
  } finally {
    await adapter.close();
  }
});

test(
  'PostgreSQL transaction rolls back when callback throws',
  { skip: !process.env.DATABASE_URL },
  async () => {
    const adapter = new PostgreSQLAdapter(process.env.DATABASE_URL!);
    const table = quoteIdentifier(`__transaction_probe_${process.pid}_${Date.now()}`);

    try {
      await adapter.db.execute(sql.raw(`CREATE TABLE ${table} (id text PRIMARY KEY)`));

      await adapter.transaction(async (tx) => {
        await tx.execute(sql.raw(`INSERT INTO ${table} (id) VALUES ('committed')`));
      });

      await expect(
        adapter.transaction(async (tx) => {
          await tx.execute(sql.raw(`INSERT INTO ${table} (id) VALUES ('rolled-back')`));
          throw new Error('force rollback');
        })).rejects.toThrow(/force rollback/);

      const rows = await adapter.db.execute(sql.raw(`SELECT count(*)::int AS count FROM ${table}`));
      expect(Number(rows[0]?.count)).toBe(1);
    } finally {
      await adapter.db.execute(sql.raw(`DROP TABLE IF EXISTS ${table}`));
      await adapter.close();
    }
  },
);
