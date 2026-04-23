"use client";

import { useParams, useRouter } from "next/navigation";
import DynamicForm from "@/components/kiosk/DynamicForm";
import { useKioskStore } from "@/stores/useKioskStore";
import {
  useCreateOrSaveVisit,
  useFetchVisitTypeById,
} from "@/features/kiosks/queries/kiosks.queries";
import { useGetKioskMe } from "@/features/auth/queries/auth.queries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useEffect } from "react";
import { z } from "zod";

export default function Page() {
  const params = useParams() as Record<string, string>;
  const visitTypeId = params?.visitTypeId;
  const setVisitType = useKioskStore((s) => s.setVisitType);
  const setVisitId = useKioskStore((s) => s.setVisitId);
  const setSessionKey = useKioskStore((s) => s.setSessionKey);
  const setQrCode = useKioskStore((s) => s.setQrCode);
  const setFormData = useKioskStore((s) => s.setFormData);
  const setVisitor = useKioskStore((s) => s.setVisitor);
  const setImageUrl = useKioskStore((s) => s.setImageUrl);

  const kioskFormData = useKioskStore((s) => s.formData);
  const kioskVisitor = useKioskStore((s) => s.visitor);
  const kioskImageUrl = useKioskStore((s) => s.imageUrl);
  const router = useRouter();
  const createMutation = useCreateOrSaveVisit();

  const { data: kioskData } = useGetKioskMe();

  const envLocation = process.env.NEXT_PUBLIC_KIOSK_LOCATION_ID;
  const defaultLocation =
    envLocation &&
    envLocation !== "REPLACE_WITH_LOCATION_UUID" &&
    !envLocation.includes("REPLACE_WITH")
      ? envLocation
      : undefined;

  const rawLocation = kioskData?.kiosk?.location_id ?? defaultLocation;
  const locationId: string | undefined =
    rawLocation != null ? String(rawLocation) : undefined;

  const { data, isLoading, isError, error } = useFetchVisitTypeById(
    locationId,
    visitTypeId,
  );

  const visitType = (data as any)?.visit_type ?? null;

  // persist visit type into kiosk store so preview/camera pages can access it
  useEffect(() => {
    if (visitType) {
      setVisitType(visitType);
    }
  }, [visitType, setVisitType]);

  const schema = useMemo(() => {
    if (!visitType) return null;
    const shape: Record<string, any> = {};

    visitType.form_fields?.forEach((f: any) => {
      const name = f.name;
      const required = Boolean(f.required);

      let schemaField: any;

      switch (f.type) {
        case "number": {
          const num = z.preprocess(
            (val) => (val === "" ? undefined : Number(val)),
            z.number(),
          );
          schemaField = required ? num : num.optional();
          break;
        }
        case "checkbox":
          schemaField = required ? z.boolean() : z.boolean().optional();
          break;

        case "textarea":
          schemaField = z.string();
          if (!required) schemaField = schemaField.optional();
          if (required)
            schemaField = (schemaField as any).min(
              1,
              `${f.label || name} is required`,
            );
          break;
        case "select":
          schemaField = required ? z.string().min(1) : z.string().optional();
          break;
        default:
          schemaField = z.string();
          if (!required) schemaField = schemaField.optional();
          if (required)
            schemaField = (schemaField as any).min(
              1,
              `${f.label || name} is required`,
            );
          break;
      }

      shape[name] = schemaField;
    });

    return z.object(shape);
  }, [visitType]);

  const methods = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: kioskFormData ?? {},
    mode: "onTouched",
  });

  const { handleSubmit, getValues } = methods;

  const onSubmit = (formData: Record<string, any>) => {
    const visitor = {
      full_name: formData.full_name || kioskVisitor.full_name,
      email: formData.email || kioskVisitor.email,
      phone: formData.phone || kioskVisitor.phone,
    };

    const payload: any = {
      visit_type_id: visitTypeId,
      is_final: true,
      visitor,
      form_data: formData,
    };

    if (kioskImageUrl) {
      if (
        typeof kioskImageUrl === "string" &&
        kioskImageUrl.startsWith("data:")
      ) {
        payload.image_base64 = kioskImageUrl;
      } else {
        payload.image_url = kioskImageUrl;
      }
    }

    createMutation.mutate(payload, {
      onSuccess: (data: any) => {
        // Prefer top-level fields, fallback to nested visit/visitor shape
        const visitId = data.visit_id ?? data.visit?.id ?? null;
        const sessionKey = data.session_key ?? data.visit?.session_key ?? null;
        const qrCode = data.qr_code ?? data.visit?.qr_code ?? null;

        setVisitId(visitId);
        setSessionKey(sessionKey);
        setQrCode(qrCode);

        // Persist visitor data returned from server (includes generated id_number)
        if (data.visitor) {
          setVisitor(data.visitor);
          setImageUrl(data.visitor.photo_url ?? kioskImageUrl ?? null);
        } else if (data.visit && data.visit.visitor) {
          // If server returned nested visit aggregate with visitor, use it
          setVisitor(data.visit.visitor ?? {});
          setImageUrl(data.visit.visitor?.photo_url ?? kioskImageUrl ?? null);
        }

        router.push("/kiosk/checkin/success");
      },
    });
  };

  const handleContinue = () => {
    const values = getValues();
    setFormData(values);
    setVisitor({
      full_name: values.full_name ?? kioskVisitor.full_name,
      email: values.email ?? kioskVisitor.email,
      phone: values.phone ?? kioskVisitor.phone,
    });
    router.push("/kiosk/checkin/camera");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <span className="text-sm">Loading visit type…</span>
        </div>
      </div>
    );
  }

  if (isError) {
    console.error("useFetchVisitTypeById error:", error);

    let errorMessage = "An unknown error occurred.";
    try {
      const raw = (error as any)?.response?.data ?? error;
      if (raw instanceof Error) {
        errorMessage = raw.message;
      } else if (typeof raw === "string") {
        errorMessage = raw;
      } else {
        errorMessage = JSON.stringify(raw, Object.getOwnPropertyNames(raw), 2);
      }
    } catch {
      errorMessage = String(error);
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-destructive font-medium">
              Error loading visit type.
            </p>
            <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
              {errorMessage}
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!visitType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-foreground font-medium">
              Visit type data is not available.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Ensure kiosk/location is configured and retry.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-10">
      {/* Back button */}
      <div className="w-full max-w-xl mb-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-display italic text-primary">VisitNa!</h1>
        <p className="text-muted-foreground mt-2 text-base">
          {visitType?.name ?? "Unnamed"} Check - In.
        </p>
      </div>

      {/* Form card */}
      <Card className="w-full max-w-xl">
        <CardContent className="p-8 flex flex-col gap-6">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <DynamicForm formFields={visitType?.form_fields ?? []} />
              <div>
                <Button
                  type={visitType?.is_camera_active ? "button" : "submit"}
                  size="lg"
                  className="w-full"
                  onClick={
                    visitType?.is_camera_active ? handleContinue : undefined
                  }
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : visitType?.is_camera_active ? (
                    "Continue"
                  ) : (
                    "Check In"
                  )}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
