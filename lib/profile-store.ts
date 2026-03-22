import { create } from "zustand";

export type ProfileFields = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
};

type ProfileState = ProfileFields & {
  setProfile: (p: Partial<ProfileFields>) => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  fullName: "Aarav Mehta",
  email: "aarav@email.com",
  phone: "+91 98765 43210",
  city: "Mumbai",
  setProfile: (p) => set((s) => ({ ...s, ...p })),
}));

export function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
