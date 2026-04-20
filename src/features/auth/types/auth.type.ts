export type RegisterParams = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  device_name?: string;
};

export type LoginParams = {
  email: string;
  password: string;
  device_name?: string;
};

export type AuthPayload = {
  user: User;
  token: string;
};

export type UserPayload = {
  user: User;
};

export type SessionCheckPayload = {
  user_id: number | null;
  role: User["role"] | null;
};

export type LocationCheckParams = {
  location_id: number;
};

export type LocationCheckPayload = SessionCheckPayload & {
  location_id: number | null;
};

export type ActivateKioskParams = {
  code: string;
};

export type KioskActivationPayload = {
  kiosk: KioskDevice;
  token: string;
};

export type KioskProfilePayload = {
  kiosk: KioskDevice;
};
export type Role = "super_admin" | "admin" | "kiosk" | "user";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  tenant_id: number | null;
  location_id: number | null;
};

export type KioskDevice = {
  id: number;
  tenant_id: number | null;
  location_id: number | null;
  name: string;
  status: "active" | "disabled" | string;
  last_seen_at: string | null;
};

export type AuthState = {
  hydrated: boolean;
  user: User | null;
  token: string | null;

  // setters
  setAuth: (payload: { user: User; token: string }) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;

  // clear
  clearAuth: () => void;
};
