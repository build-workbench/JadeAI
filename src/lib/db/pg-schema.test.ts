import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test, expect } from 'vitest';

const pgSchemaSource = readFileSync(resolve(process.cwd(), 'src/lib/db/pg-schema.ts'), 'utf8');

test('PostgreSQL schema preserves repository-owned cascade relationships', () => {
  const cascadeReferences = [
    "resumeId: text('resume_id').notNull().references(() => resumes.id, { onDelete: 'cascade' })",
    "sessionId: text('session_id').notNull().references(() => chatSessions.id, { onDelete: 'cascade' })",
    "sessionId: text('session_id').notNull().references(() => interviewSessions.id, { onDelete: 'cascade' })",
    "roundId: text('round_id').notNull().references(() => interviewRounds.id, { onDelete: 'cascade' })",
  ];

  for (const reference of cascadeReferences) {
    expect(pgSchemaSource.includes(reference)).toBeTruthy();
  }
});

test('PostgreSQL schema preserves non-cascade owner relationships', () => {
  expect(pgSchemaSource.includes("userId: text('user_id').notNull().references(() => users.id)")).toBeTruthy();
  expect(pgSchemaSource.includes("resumeId: text('resume_id').references(() => resumes.id)")).toBeTruthy();
});
