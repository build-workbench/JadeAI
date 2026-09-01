
import { resolveDatabaseConfig } from './config';
import { test, expect } from 'vitest';

function withWarnings() {
  const warnings: string[] = [];
  return {
    warnings,
    options: {
      warn(message: string) {
        warnings.push(message);
      },
    },
  };
}

test('defaults to local SQLite when DB_TYPE is omitted', () => {
  const { warnings, options } = withWarnings();

  expect(resolveDatabaseConfig({}, options)).toEqual({
    type: 'sqlite',
    sqlitePath: './data/jade.db',
  });
  expect(warnings).toEqual([]);
});

test('keeps SQLite in production without DATABASE_URL for existing installs and warns', () => {
  const { warnings, options } = withWarnings();

  expect(resolveDatabaseConfig({ NODE_ENV: 'production' }, options)).toEqual({
    type: 'sqlite',
    sqlitePath: './data/jade.db',
  });
  expect(warnings.length).toBe(1);
  expect(warnings[0]).toMatch(/using SQLite .* backwards compatibility/);
});

test('rejects PostgreSQL without DATABASE_URL', () => {
  expect(
    () => resolveDatabaseConfig({ DB_TYPE: 'postgresql' })).toThrow(/DB_TYPE=postgresql requires DATABASE_URL/);
});

test('rejects SQLite on Vercel', () => {
  expect(() => resolveDatabaseConfig({ DB_TYPE: 'sqlite', DATABASE_URL: 'postgres://db', VERCEL: '1' })).toThrow(/SQLite is not supported on Vercel/);
});

test('rejects unsupported database type', () => {
  expect(() => resolveDatabaseConfig({ DB_TYPE: 'mysql' })).toThrow(/Unsupported DB_TYPE "mysql"/);
});

test('resolves PostgreSQL with a database URL', () => {
  expect(resolveDatabaseConfig({
    DB_TYPE: 'postgresql',
    DATABASE_URL: 'postgres://user:pass@example.test:5432/jade',
  })).toEqual({
    type: 'postgresql',
    databaseUrl: 'postgres://user:pass@example.test:5432/jade',
  });
});

test('infers PostgreSQL when DB_TYPE is omitted but DATABASE_URL is set', () => {
  const { warnings, options } = withWarnings();

  expect(resolveDatabaseConfig({
    DATABASE_URL: ' postgres://user:pass@example.test:5432/jade ',
  }, options)).toEqual({
    type: 'postgresql',
    databaseUrl: 'postgres://user:pass@example.test:5432/jade',
  });
  expect(warnings.length).toBe(1);
  expect(warnings[0]).toMatch(/using PostgreSQL because DATABASE_URL is present/);
});

test('honors explicit SQLite with DATABASE_URL and warns that URL is ignored', () => {
  const { warnings, options } = withWarnings();

  expect(resolveDatabaseConfig({
    DB_TYPE: 'sqlite',
    DATABASE_URL: 'postgres://user:pass@example.test:5432/jade',
    SQLITE_PATH: './data/existing.db',
  }, options)).toEqual({
    type: 'sqlite',
    sqlitePath: './data/existing.db',
  });
  expect(warnings.length).toBe(1);
  expect(warnings[0]).toMatch(/DATABASE_URL is set but DB_TYPE=sqlite/);
});
