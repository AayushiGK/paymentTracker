module.exports = {
    testEnvironment: 'node', // Use Node.js environment for testing
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'], // Match test files
    collectCoverage: true, // Enable code coverage
    collectCoverageFrom: ['**/controller/**/*.js'], // Specify files for coverage
    coverageDirectory: 'coverage', // Output directory for coverage reports
};