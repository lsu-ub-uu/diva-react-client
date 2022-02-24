/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testPathIgnorePatterns: ['./node_modules/', './lists/', './lib/'],
	collectCoverage: false,
	collectCoverageFrom: ['./src/**'],
	coveragePathIgnorePatterns: [
		'./src/index.tsx',
	],
	coverageThreshold: {
		global: {
			statements: 100,
			branches: 100,
			functions: 100,
			lines: 100,
		},
	},
	clearMocks: true,
};
