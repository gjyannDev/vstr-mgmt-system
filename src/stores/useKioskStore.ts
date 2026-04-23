import { create } from "zustand";
import type { VisitType } from "@/features/visit-types/schemas/visit-type.schemas";

type Visitor = {
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  [key: string]: any;
};

type KioskState = {
  visitType?: VisitType | null;
  visitor: Visitor;
  formData: Record<string, any>;
  imageUrl?: string | null;
  sessionKey?: string | null;
  visitId?: string | null;
  qrCode?: string | null;
  setVisitType: (v: VisitType | null) => void;
  setVisitor: (v: Visitor) => void;
  setFormData: (d: Record<string, any>) => void;
  setImageUrl: (u?: string | null) => void;
  setSessionKey: (s?: string | null) => void;
  setVisitId: (id?: string | null) => void;
  setQrCode: (code?: string | null) => void;
  clearAll: () => void;
};

export const useKioskStore = create<KioskState>((set) => ({
  visitType: null,
  visitor: {},
  formData: {},
  imageUrl: null,
  sessionKey: null,
  visitId: null,
  qrCode: null,

  setVisitType: (v) => set({ visitType: v }),
  setVisitor: (v) => set({ visitor: { ...v } }),
  setFormData: (d) => set({ formData: { ...d } }),
  setImageUrl: (u) => set({ imageUrl: u ?? null }),
  setSessionKey: (s) => set({ sessionKey: s ?? null }),
  setVisitId: (id) => set({ visitId: id ?? null }),
  setQrCode: (c) => set({ qrCode: c ?? null }),
  clearAll: () =>
    set({
      visitType: null,
      visitor: {},
      formData: {},
      imageUrl: null,
      sessionKey: null,
      visitId: null,
      qrCode: null,
    }),
}));
