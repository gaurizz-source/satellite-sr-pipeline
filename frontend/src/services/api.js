const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Check whether the Satellite SR backend is running.
 */
export async function checkBackendHealth() {
  const response = await fetch(
    `${API_BASE_URL}/api/health`
  );

  if (!response.ok) {
    throw new Error(
      `Backend health check failed (${response.status})`
    );
  }

  return response.json();
}


/**
 * Send a 4-band GeoTIFF to the real
 * super-resolution backend.
 */
export async function superResolve(file) {
  if (!file) {
    throw new Error("No satellite image selected.");
  }

  const isTiff =
    file.name.toLowerCase().endsWith(".tif") ||
    file.name.toLowerCase().endsWith(".tiff");

  if (!isTiff) {
    throw new Error(
      "Please upload a 4-band GeoTIFF (.tif or .tiff)."
    );
  }

  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/super-resolve`,
    {
      method: "POST",
      body: formData,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The backend returned an invalid response."
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Super-resolution failed (${response.status}).`
    );
  }

  if (data.status !== "success") {
    throw new Error(
      data.message ||
        "Super-resolution did not complete successfully."
    );
  }

  return data;
}


/**
 * Convert the backend's relative output URL
 * into a complete browser-accessible URL.
 */
export function getOutputUrl(outputUrl) {
  if (!outputUrl) {
    return null;
  }

  if (outputUrl.startsWith("http")) {
    return outputUrl;
  }

  return `${API_BASE_URL}${outputUrl}`;
}