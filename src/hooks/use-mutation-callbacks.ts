import axios from "axios";
import { toast } from "sonner";

type ActionMode =
  | "create"
  | "update"
  | "delete"
  | "change"
  | "assigned"
  | string;

interface UseCrudCallbacksParams {
  entityName: string;
  onClose?: () => void;
}

type SideEffect = () => void;
type SideEffects = SideEffect | SideEffect[] | undefined;

interface BuildCallbackEffects {
  onSuccess?: SideEffects;
  onError?: SideEffects;
  successMessage?: string;
  errorMessage?: string;
}

interface CustomAPIError {
  status: number;
  message?: string | string[];
  data?: unknown;
  errorCode?: string;
}

const isCustomAPIError = (err: unknown): err is CustomAPIError => {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    typeof err.status === "number"
  );
};

const runEffects = (effects?: SideEffects) => {
  if (!effects) return;
  if (Array.isArray(effects)) {
    effects.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error("SideEffectError:", e);
      }
    });
  } else {
    try {
      effects();
    } catch (e) {
      console.error("SideEffectError:", e);
    }
  }
};

const getErrorMessage = (err?: unknown) => {
  // Handle your custom error format from interceptor
  if (isCustomAPIError(err)) {
    if (typeof err.message === "string") return err.message;
    if (Array.isArray(err.message)) return err.message.join(", ");

    // Try to get error from data field
    if (err.data) {
      if (typeof err.data === "string") return err.data;

      // Type guard for data.message
      if (
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data
      ) {
        const dataMessage = err.data.message;
        if (typeof dataMessage === "string") return dataMessage;
        if (Array.isArray(dataMessage)) return dataMessage.join(", ");
      }
    }
  }

  // Handle standard Axios-like errors (duck-typed)
  if (typeof err === "object" && err !== null && "response" in err) {
    const e = err as any;
    const data = e.response?.data;

    if (!data)
      return (
        e?.message ?? (e instanceof Error ? e.message : "Please try again.")
      );

    if (typeof data === "string") return data;

    if (data?.message) {
      if (typeof data.message === "string") return data.message;
      if (Array.isArray(data.message)) return data.message.join(", ");
      try {
        return JSON.stringify(data.message);
      } catch {
        return (
          e?.message ?? (e instanceof Error ? e.message : "Please try again.")
        );
      }
    }

    try {
      return JSON.stringify(data);
    } catch {
      return (
        e?.message ?? (e instanceof Error ? e.message : "Please try again.")
      );
    }
  }

  if (err instanceof Error) return err.message;

  return "Please try again.";
};

export const useMutationCallbacks = ({
  entityName,
  onClose,
}: UseCrudCallbacksParams) => {
  const buildCallbacks = (
    mode: ActionMode,
    subject: string,
    effects?: BuildCallbackEffects,
  ) => ({
    onSuccess: () => {
      toast.success(
        effects?.successMessage ?? `${entityName} ${mode}d`,
        effects?.successMessage
          ? undefined
          : {
              description: `${subject} ${
                mode === "delete"
                  ? "deleted"
                  : mode === "update"
                    ? "updated"
                    : "created"
              } successfully.`,
            },
      );
      runEffects(effects?.onSuccess);
      onClose?.();
    },
    onError: (error?: unknown) => {
      toast.error(effects?.errorMessage ?? `${entityName} ${mode} failed`, {
        description: getErrorMessage(error),
      });
      runEffects(effects?.onError);
    },
  });

  return { buildCallbacks };
};
