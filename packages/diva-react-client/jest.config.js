/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	testPathIgnorePatterns: ['./node_modules/', './lists/', './lib/', './dist/'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	collectCoverage: false,
	collectCoverageFrom: ['./src/**'],
	coveragePathIgnorePatterns: [
		'./src/components/Layout/',
		'./src/styles/',
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
