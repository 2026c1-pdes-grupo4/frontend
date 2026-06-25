process.loadEnvFile('.env')

export default {
  import: ['e2e/support/*.ts', 'e2e/step_definitions/**/*.ts'],
  format: ['progress-bar', 'html:e2e-report.html'],
  worldParameters: {
    baseUrl: process.env.BASE_URL ?? 'http://localhost:5173',
    headless: process.env.HEADED ?? 'false',
  },
}
