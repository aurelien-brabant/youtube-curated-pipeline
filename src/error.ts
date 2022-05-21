export const fatalError = (message = '', exitCode = 1) => {
    console.error(`FATAL ERROR (${exitCode}): ${message}`);
    process.exit(exitCode);
};
