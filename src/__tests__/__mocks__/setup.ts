import { instance, mock } from 'ts-mockito'
import { LogService } from '../../services/LogService'
import Services from '../../services/repository/Services'
import { afterEach, beforeEach, vi } from 'vitest'

beforeEach(() => {
  Services.services = []
  Services.configure(LogService, undefined, instance(mock<LogService>()))
})

afterEach(() => {
  localStorage.clear() // Cleaning test that set values in the local storage mock
  vi.useRealTimers() // Cleaning tests that use fake times
})

// This code allows to find unhandled rejected promises (lines containing "UnhandledPromiseRejectionWarning" appearing in the test logs even when all tests pass).
// Test files containing this error will appear when using the "npm run test".
// Test files containing this error may also appear in the "Problems" tab with the "Call retries were exceeded" error when launched by the Jest runner.
// Cf https://stackoverflow.com/a/71997603
process.on('unhandledRejection', (reason) => {
  throw reason
})