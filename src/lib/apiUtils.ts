// src/lib/apiUtils.ts

/**
 * Enhanced fetch wrapper with better error handling for APIs
 */
export async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;

      // Check content type to handle different error formats
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        // It's JSON, so parse the error
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If JSON parsing fails, just use the status
          console.error("Failed to parse error JSON", e);
        }
      } else {
        // For debugging purposes, try to get the text
        try {
          const text = await response.text();
          console.error(
            "Response was not JSON:",
            text.substring(0, 500)
          );
        } catch (e) {
          // Ignore if we can't get the text
        }
      }

      throw new Error(errorMessage);
    }

    // Check if response has content
    const contentType = response.headers.get("content-type");
    if (response.status === 204 || !contentType) {
      // No content
      return {} as T;
    }

    // Handle JSON responses
    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    // For non-JSON responses, return the text
    const text = await response.text();
    try {
      // Try to parse as JSON anyway, in case the content-type is incorrect
      return JSON.parse(text) as T;
    } catch (e) {
      // If it's not JSON, throw an error
      throw new Error(`Expected JSON but received: ${contentType}`);
    }
  } catch (error) {
    // Add more context to the error
    if (error instanceof Error) {
      console.error(`API request to ${url} failed:`, error.message);
    } else {
      console.error(
        `API request to ${url} failed with unknown error`
      );
    }
    throw error;
  }
}

/**
 * Log API response for debugging
 */
export function logApiResponse<T>(data: T, endpoint: string): T {
  console.log(
    `API Response from ${endpoint}:`,
    JSON.stringify(data).substring(0, 500) + "..."
  );
  return data;
}
