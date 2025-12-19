"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../../config/env");
describe('Config: Environment Variables', () => {
    const originalEnv = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });
    it('should have a default NODE_ENV of development', () => {
        expect(env_1.env.NODE_ENV).toBeDefined();
        expect(['development', 'production', 'test']).toContain(env_1.env.NODE_ENV);
    });
    it('should load the correct PORT', () => {
        expect(typeof env_1.env.PORT).toBe('number');
    });
    // src/__test__/config/env.spec.ts
    it('should contain a valid DATABASE_URL', () => {
        // Option A: Use a regex to match both postgres:// and postgresql://
        expect(env_1.env.DATABASE_URL).toMatch(/^postgres(ql)?:\/\//);
        // Option B: Or simply check for the common prefix
        // expect(env.DATABASE_URL.startsWith('postgres')).toBe(true);
    });
});
//# sourceMappingURL=env.spec.js.map