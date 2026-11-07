
import { create } from "zustand";

export interface RegistrationDraft {
    bvn: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    tagName: string;
    referralCode: string;
}

interface RegistrationState {
    draft: RegistrationDraft;
    updateDraft: (updates: Partial<RegistrationDraft>) => void;
    clearDraft: () => void;
}

const initialDraft: RegistrationDraft = {
    bvn: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    tagName: "",
    referralCode: "",
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
    draft: { ...initialDraft },

    updateDraft: (updates) =>
        set((state) => ({
            draft: {
                ...state.draft,
                ...updates,
            },
        })),

    clearDraft: () => set({ draft: { ...initialDraft } }),
}));
