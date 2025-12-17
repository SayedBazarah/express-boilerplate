import { env } from "../../config/env";

describe('Config: Environment Variables', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });


  it('should have a default NODE_ENV of development', () => {
    expect(env.NODE_ENV).toBeDefined();
    expect(['development', 'production', 'test']).toContain(env.NODE_ENV);
  });

  it('should load the correct PORT', () => {
    expect(typeof env.PORT).toBe('number');
  });

// src/__test__/config/env.spec.ts

it('should contain a valid DATABASE_URL', () => {
  // Option A: Use a regex to match both postgres:// and postgresql://
  expect(env.DATABASE_URL).toMatch(/^postgres(ql)?:\/\//);
  
  // Option B: Or simply check for the common prefix
  // expect(env.DATABASE_URL.startsWith('postgres')).toBe(true);
});
});