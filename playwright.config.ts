import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests", // folder tempat e2e test
  fullyParallel: true,
  retries: 1,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: "http://localhost:3000", // Next.js default dev server
    trace: "on-first-retry", // collect trace untuk debugging
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "npm run dev", // start Next.js dev server
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI, // biar tidak double start kalau sudah running
  },
});
