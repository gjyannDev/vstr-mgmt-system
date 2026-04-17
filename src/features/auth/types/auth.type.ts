export type User = {
  id: number;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "kiosk" | "customer" | "user";
  tenant_id: number | null;
  location_id: number | null;
};

export type AuthState = {
  user: User | null;
  token: string | null;

  // setters
  setAuth: (payload: { user: User; token: string }) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;

  // clear
  clearAuth: () => void;
};
