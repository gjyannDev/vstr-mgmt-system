import ImageKit from "imagekit-javascript";

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? "";
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? "";
const authEndpoint =
  process.env.NEXT_PUBLIC_IMAGEKIT_AUTH_ENDPOINT ?? "/api/imagekit/auth";

const ImageKitAny: any = ImageKit as any;
const ImageKitClient: any =
  typeof ImageKitAny === "function"
    ? ImageKitAny
    : (ImageKitAny.default ?? ImageKitAny);
const imagekit: any = new ImageKitClient({
  publicKey,
  urlEndpoint,
  authenticationEndpoint: authEndpoint,
});

export async function uploadBase64(
  dataUrl: string,
  fileName?: string,
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("uploadBase64 must be called from the browser");
  }

  const name = fileName ?? `kiosk_${Date.now()}.jpg`;

  const result = await imagekit.upload({
    file: dataUrl,
    fileName: name,
  } as any);

  return (result as any)?.url || (result as any)?.filePath || "";
}
