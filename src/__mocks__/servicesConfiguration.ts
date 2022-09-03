import { instance, mock } from 'ts-mockito'
import { LogService } from '../services/LogService'
import Services from '../services/repository/Services'

beforeEach(() => {
  jest.useFakeTimers()

  Services.services = []
  Services.configure(LogService, undefined, instance(mock<LogService>()))
})

afterEach(() => {
  jest.useRealTimers()
})

// // This code allows to find unhandled rejected promise.
// // It should be only used for testing purpose
// // Cf https://stackoverflow.com/a/71997603
// process.on('unhandledRejection', (reason) => {
//   console.log(reason)
//   throw e
// })