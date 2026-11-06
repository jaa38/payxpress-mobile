
import { coreClient } from "@/lib/http/core-client";
import { authApi } from "@/services/auth/auth-api";

jest.mock("@/lib/http/core-client", () => ({
    coreClient: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

const mockedGet = jest.mocked(coreClient.get);
const mockedPost = jest.mocked(coreClient.post);

describe("authApi", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("verifies BVN", async () => {
        mockedGet.mockResolvedValueOnce({ data: { success: true } } as never);

        await authApi.verifyBvn("12345678901");

        expect(mockedGet).toHaveBeenCalledWith(
            "/Auth/verify-bvn/12345678901",
        );
    });

    it("generates OTP using the documented path", async () => {
        mockedGet.mockResolvedValueOnce({ data: { success: true } } as never);

        await authApi.generateOtp("test@example.com", "08012345678");

        expect(mockedGet).toHaveBeenCalledWith(
            "/Auth/generate-otp//test%40example.com/08012345678",
        );
    });

    it("logs in without requiring an app token", async () => {
        const payload = { example: "test" };

        mockedPost.mockResolvedValueOnce({ data: { success: true } } as never);

        await authApi.login(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Auth/login",
            payload,
        );
    });

    it("registers a user", async () => {
        const payload = { example: "test" };

        mockedPost.mockResolvedValueOnce({ data: { success: true } } as never);

        await authApi.register(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Auth/register",
            payload,
        );
    });

    it("refreshes the token", async () => {
        const payload = { example: "refresh" };

        mockedPost.mockResolvedValueOnce({ data: { success: true } } as never);

        await authApi.refreshToken(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Auth/refresh-token",
            payload,
        );
    });

    it("marks PIN reset OTP as authenticated", async () => {
        const payload = { example: "pin-reset" };

        mockedPost.mockResolvedValueOnce({ data: { success: true } } as never);

        await authApi.resetPinOtp(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Auth/reset-pin-otp",
            payload,
            { requiresAuth: true },
        );
    });



    it("changes the user's password with authentication", async () => {
        const payload = { example: "password-change" };

        mockedPost.mockResolvedValueOnce({ data: { success: true } } as never);

        await authApi.changePassword(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Users/change-password/",
            payload,
            { requiresAuth: true },
        );
    });

    it("changes the user's wallet PIN with authentication", async () => {
        const payload = { example: "pin-change" };

        mockedPost.mockResolvedValueOnce({ data: { success: true } } as never);

        await authApi.changeWalletPin(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Wallet/changepin",
            payload,
            { requiresAuth: true },
        );
    });

    it("retrieves a user with authentication", async () => {
        mockedGet.mockResolvedValueOnce({ data: { success: true } } as never);

        await authApi.getUser("123");

        expect(mockedGet).toHaveBeenCalledWith(
            "/Users/getall/123",
            { requiresAuth: true },
        );
    });

    it("verifies BVN OTP", async () => {
        const payload = { otp: "123456" };

        mockedPost.mockResolvedValueOnce({ data: { success: true } } as never);

        const result = await authApi.verifyBvnOtp(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Auth/verify-otp/bvn",
            payload,
        );

        expect(result).toEqual({ success: true });
    });

    it("verifies OTP without requiring authentication by default", async () => {
        const payload = { otp: "123456" };

        mockedPost.mockResolvedValueOnce({ data: { success: true } } as never);

        await authApi.verifyOtp(payload);

        expect(mockedPost).toHaveBeenCalledWith(
            "/Auth/verify-otp",
            payload,
            { requiresAuth: false },
        );
    });

    it("requests password recovery using an encoded email address", async () => {
        mockedPost.mockResolvedValueOnce({ data: { success: true } } as never);

        const result = await authApi.forgotPassword("test@example.com");

        expect(mockedPost).toHaveBeenCalledWith(
            "/Auth/forgot-password/test%40example.com",
        );

        expect(result).toEqual({ success: true });
    });

});
