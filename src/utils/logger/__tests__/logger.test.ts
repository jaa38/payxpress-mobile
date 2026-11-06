
const originalDev = __DEV__;

describe("logger", () => {
    let debugSpy: jest.SpyInstance;
    let infoSpy: jest.SpyInstance;
    let warnSpy: jest.SpyInstance;
    let errorSpy: jest.SpyInstance;

    beforeEach(() => {
        debugSpy = jest.spyOn(console, "debug").mockImplementation();
        infoSpy = jest.spyOn(console, "info").mockImplementation();
        warnSpy = jest.spyOn(console, "warn").mockImplementation();
        errorSpy = jest.spyOn(console, "error").mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        (globalThis as unknown as { __DEV__: boolean }).__DEV__ = originalDev;
    });

    it("logs debug messages in development", () => {
        (globalThis as unknown as { __DEV__: boolean }).__DEV__ = true;

        jest.isolateModules(() => {
            const { logger } = require("@/utils/logger/logger");

            logger.debug("Debug message");

            expect(debugSpy).toHaveBeenCalledWith("[DEBUG]", "Debug message");
        });
    });

    it("logs informational messages in development", () => {
        (globalThis as unknown as { __DEV__: boolean }).__DEV__ = true;

        jest.isolateModules(() => {
            const { logger } = require("@/utils/logger/logger");

            logger.info("Info message");

            expect(infoSpy).toHaveBeenCalledWith("[INFO]", "Info message");
        });
    });

    it("logs warnings in development", () => {
        (globalThis as unknown as { __DEV__: boolean }).__DEV__ = true;

        jest.isolateModules(() => {
            const { logger } = require("@/utils/logger/logger");

            logger.warn("Warning message");

            expect(warnSpy).toHaveBeenCalledWith("[WARN]", "Warning message");
        });
    });

    it("logs safe error messages in development", () => {
        (globalThis as unknown as { __DEV__: boolean }).__DEV__ = true;

        jest.isolateModules(() => {
            const { logger } = require("@/utils/logger/logger");

            logger.error("Something failed.");

            expect(errorSpy).toHaveBeenCalledWith(
                "[ERROR]",
                "Something failed.",
            );
        });
    });

    it("does not log in production", () => {
        (globalThis as unknown as { __DEV__: boolean }).__DEV__ = false;

        jest.isolateModules(() => {
            const { logger } = require("@/utils/logger/logger");

            logger.debug("Debug");
            logger.info("Info");
            logger.warn("Warning");
            logger.error("Error");

            expect(debugSpy).not.toHaveBeenCalled();
            expect(infoSpy).not.toHaveBeenCalled();
            expect(warnSpy).not.toHaveBeenCalled();
            expect(errorSpy).not.toHaveBeenCalled();
        });
    });
});
