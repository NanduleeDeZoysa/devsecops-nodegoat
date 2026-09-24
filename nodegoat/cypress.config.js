const { defineConfig } = require("cypress");
const { port, hostName } = require("./config/env/all");

module.exports = defineConfig({
  e2e: {
    baseUrl: `http://${hostName}:${port}`,
    specPattern: "test/e2e/integration/**/*.js",
    supportFile: "test/e2e/support/index.js",
    fixturesFolder: "test/e2e/fixtures",
    screenshotsFolder: "test/e2e/screenshots",
    videosFolder: "test/e2e/videos",
    video: false,

    setupNodeEvents(on, config) {
      const { execSync } = require("child_process");
    
      on("task", {
        dbReset() {
          execSync("npm run db:seed", {
            stdio: "inherit",
            env: {
              ...process.env,
              NODE_ENV: "test"
            }
          });
    
          return null;
        }
      });
    
      return config;
    }
  }
});
