import { STORAGE_KEYS } from "@/constants/storage";
import { authSession } from "@/services/auth/auth-session";
import { secureStorage } from "@/services/storage/secure-storage";

jest.mock("@/services/storage/secure-storage", () => ({
  secureStorage: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockedSecureStorage = secureStorage as jest.Mocked<typeof secureStorage>;

describe("authSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a complete session when both tokens exist", async () => {
    mockedSecureStorage.getItem
      .mockResolvedValueOnce("access-token")
      .mockResolvedValueOnce("refresh-token");

    await expect(authSession.getSession()).resolves.toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    expect(mockedSecureStorage.getItem).toHaveBeenCalledWith(
      STORAGE_KEYS.accessToken,
    );

    expect(mockedSecureStorage.getItem).toHaveBeenCalledWith(
      STORAGE_KEYS.refreshToken,
    );
  });

  it("returns null when the access token is missing", async () => {
    mockedSecureStorage.getItem
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce("refresh-token");

    await expect(authSession.getSession()).resolves.toBeNull();
  });

  it("returns null when the refresh token is missing", async () => {
    mockedSecureStorage.getItem
      .mockResolvedValueOnce("access-token")
      .mockResolvedValueOnce(null);

    await expect(authSession.getSession()).resolves.toBeNull();
  });

  it("saves both session tokens", async () => {
    mockedSecureStorage.setItem.mockResolvedValue(undefined);

    await authSession.saveSession({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    expect(mockedSecureStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.accessToken,
      "access-token",
    );

    expect(mockedSecureStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.refreshToken,
      "refresh-token",
    );
  });

  it("clears both session tokens", async () => {
    mockedSecureStorage.removeItem.mockResolvedValue(undefined);

    await authSession.clearSession();

    expect(mockedSecureStorage.removeItem).toHaveBeenCalledWith(
      STORAGE_KEYS.accessToken,
    );

    expect(mockedSecureStorage.removeItem).toHaveBeenCalledWith(
      STORAGE_KEYS.refreshToken,
    );
  });
});
