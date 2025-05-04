// Types for environment variables
interface AppConfig {
  apiBase: string;
  sportmonksToken: string;
}

const getEnv = (key: string): string => {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const config: AppConfig = {
  apiBase: getEnv("VITE_API_BASE"),
  sportmonksToken: getEnv("VITE_SPORTMONKS_TOKEN"),
};
