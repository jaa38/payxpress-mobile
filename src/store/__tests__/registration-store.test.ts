
import { useRegistrationStore } from "@/store/registration-store";

describe("registration-store", () => {
    beforeEach(() => {
        useRegistrationStore.getState().clearDraft();
    });

    it("initialises with an empty registration draft", () => {
        expect(useRegistrationStore.getState().draft).toEqual({
            bvn: "",
            fullName: "",
            email: "",
            phoneNumber: "",
            tagName: "",
            referralCode: "",
        });
    });

    it("updates BVN verification details", () => {
        useRegistrationStore.getState().updateDraft({
            bvn: "12345678901",
            fullName: "John Doe",
            phoneNumber: "08012345678",
        });

        expect(useRegistrationStore.getState().draft).toMatchObject({
            bvn: "12345678901",
            fullName: "John Doe",
            phoneNumber: "08012345678",
        });
    });

    it("preserves existing registration details when updating BVN data", () => {
        const store = useRegistrationStore.getState();

        store.updateDraft({
            email: "john@example.com",
            tagName: "johndoe",
            referralCode: "XPRESS123",
        });

        useRegistrationStore.getState().updateDraft({
            bvn: "12345678901",
            fullName: "John Doe",
            phoneNumber: "08012345678",
        });

        expect(useRegistrationStore.getState().draft).toEqual({
            bvn: "12345678901",
            fullName: "John Doe",
            email: "john@example.com",
            phoneNumber: "08012345678",
            tagName: "johndoe",
            referralCode: "XPRESS123",
        });
    });

    it("updates individual fields without overwriting other fields", () => {
        useRegistrationStore.getState().updateDraft({
            email: "john@example.com",
            tagName: "johndoe",
        });

        useRegistrationStore.getState().updateDraft({
            email: "new@example.com",
        });

        expect(useRegistrationStore.getState().draft.email).toBe(
            "new@example.com",
        );

        expect(useRegistrationStore.getState().draft.tagName).toBe(
            "johndoe",
        );
    });

    it("clears the complete registration draft", () => {
        useRegistrationStore.getState().updateDraft({
            bvn: "12345678901",
            fullName: "John Doe",
            email: "john@example.com",
            phoneNumber: "08012345678",
            tagName: "johndoe",
            referralCode: "XPRESS123",
        });

        useRegistrationStore.getState().clearDraft();

        expect(useRegistrationStore.getState().draft).toEqual({
            bvn: "",
            fullName: "",
            email: "",
            phoneNumber: "",
            tagName: "",
            referralCode: "",
        });
    });
});
