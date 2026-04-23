import ImageKit from "imagekit-javascript";

const DEFAULT_AUTH_ENDPOINT = "/api/imagekit/auth";

let imagekit: any | null = null;

function getImageKitClient() {
  if (imagekit) return imagekit;

  if (typeof window === "undefined") {
    throw new Error("ImageKit client can only be initialized in the browser");
  }

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY ?? "";
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT ?? "";
  const authEndpoint =
    process.env.NEXT_PUBLIC_IMAGEKIT_AUTH_ENDPOINT ?? DEFAULT_AUTH_ENDPOINT;

  if (!urlEndpoint) {
    throw new Error("Missing IMAGEKIT_URL_ENDPOINT during SDK initialization");
  }

  const ImageKitAny: any = ImageKit as any;
  const ImageKitClient: any =
    typeof ImageKitAny === "function"
      ? ImageKitAny
      : (ImageKitAny.default ?? ImageKitAny);

  imagekit = new ImageKitClient({
    publicKey,
    urlEndpoint,
    authenticationEndpoint: authEndpoint,
  });

  return imagekit;
}

export async function uploadBase64(
  dataUrl: string,
  fileName?: string,
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("uploadBase64 must be called from the browser");
  }

  const client = getImageKitClient();
  const name = fileName ?? `kiosk_${Date.now()}.jpg`;

  const result = await client.upload({
    file: dataUrl,
    fileName: name,
  } as any);

  return (result as any)?.url || (result as any)?.filePath || "";
}
