module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy', // Mock CSS/SCSS imports
    },
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts'], // Add this line
};