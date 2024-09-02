module.exports = {
    roots: ['<rootDir>/src', "<rootDir>/tests"],
    transform: {
        '^.+\\.jsx?$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'jsx'],
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        'node_modules/(?!(axios)/)' 
    ],
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)', // Default pattern for __tests__ folders
        '**/?(*.)+(spec|test).[jt]s?(x)' // Default pattern for test files
    ],
};