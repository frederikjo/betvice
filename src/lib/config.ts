// Types for environment variables
interface AppConfig {
  apiBase: string;
  sportmonksToken: string;
}

const getEnv = (key: string, required = true): string => {
  const value = import.meta.env[key as keyof ImportMetaEnv] as string;
  if (!value && required) {
    console.error(`Missing environment variable: ${key}`);
    // Use default values in development instead of throwing
    return "";
  }
  return value;
};

// Default values for local development
const defaultConfig: AppConfig = {
  apiBase: "https://api.sportmonks.com/v3",
  sportmonksToken: "YOUR_API_TOKEN_HERE", // Replace with your actual token for testing
};

export const config: AppConfig = {
  apiBase: getEnv("VITE_API_BASE", false) || defaultConfig.apiBase,
  sportmonksToken:
    getEnv("VITE_SPORTMONKS_TOKEN", false) ||
    defaultConfig.sportmonksToken,
};
