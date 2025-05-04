// src/lib/envChecker.ts

/**
 * Function to check if the environment is configured correctly
 */
export function checkEnvironmentSetup() {
  const apiToken = import.meta.env.VITE_SPORTMONKS_TOKEN;

  console.log("==== Environment Configuration Check ====");
  console.log(
    `SportMonks API Token: ${apiToken ? "✅ Present" : "❌ Missing"}`
  );

  if (!apiToken) {
    console.warn(`
        ⚠️ IMPORTANT: Your SportMonks API token is missing!
        
        To fetch real data from SportMonks, you need to:
        
        1. Create a .env file in your project root (if it doesn't exist)
        2. Add your API token: VITE_SPORTMONKS_TOKEN=your_token_here
        3. Restart your development server
        
        Without this token, the application will fall back to mock data.
      `);
  }

  return {
    isConfigured: !!apiToken,
    apiToken: apiToken ? "Present" : "Missing",
  };
}

// Run the check when this module is imported
checkEnvironmentSetup();
