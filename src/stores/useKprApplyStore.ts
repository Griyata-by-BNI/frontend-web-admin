// stores/useKprApplyStore.ts
import { PropertyDetail } from "@/types/property";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

const MAX_STEP = 5;

export type KprFormData = Record<string, any>;

type State = {
  currentStep: number;
  formData: KprFormData;
  property: PropertyDetail | null;
};

type Actions = {
  setCurrentStep: (step: number) => void;
  next: (stepData?: Partial<KprFormData>) => void;
  prev: () => void;
  updateForm: (data: Partial<KprFormData>) => void;
  reset: () => void;

  // property slice
  setProperty: (p: NonNullable<PropertyDetail>) => void;
  clearProperty: () => void;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

export const useKprApplyStore = create<State & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        currentStep: 0,
        formData: {},
        property: null,

        setCurrentStep: (step) =>
          set({ currentStep: clamp(step, 0, MAX_STEP) }),

        next: (stepData) =>
          set((state) => ({
            currentStep: clamp(state.currentStep + 1, 0, MAX_STEP),
            formData: stepData
              ? { ...state.formData, ...stepData }
              : state.formData,
          })),

        prev: () =>
          set((state) => ({
            currentStep: clamp(state.currentStep - 1, 0, MAX_STEP),
          })),

        updateForm: (data) =>
          set((state) => ({ formData: { ...state.formData, ...data } })),

        reset: () => set({ currentStep: 0, formData: {}, property: null }),

        // ---- property slice ----
        setProperty: (p) => set({ property: { ...p } }),
        clearProperty: () => set({ property: null }),
      }),
      {
        name: "kpr-apply-store",
        storage: createJSONStorage(() => localStorage),
        // Jika TIDAK ingin persist property:
        // partialize: (s) => ({ currentStep: s.currentStep, formData: s.formData }),
      }
    )
  )
);
