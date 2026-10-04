import { defineConfig, devices } from "@playwright/test";

// Three widths, not three browsers: the suite guards our own layout, so the
// renderer is held fixed and the viewport is the variable. See DECISIONS D12.
const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
};

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  // A committed .only would silently shrink the suite to one test in CI.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["html", { open: "never" }]],

  // Snapshots live next to the spec, one directory per project, so a 390px
  // baseline can never be compared against a 1440px render.
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: Object.entries(VIEWPORTS).map(([name, viewport]) => ({
    name,
    use: { ...devices["Desktop Chrome"], viewport, deviceScaleFactor: 1 },
  })),

  webServer: {
    command: "pnpm build && pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
