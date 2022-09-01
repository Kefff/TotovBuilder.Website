import { instance, mock } from 'ts-mockito'
import { LogService } from '../services/LogService'
import Services from '../services/repository/Services'

beforeAll(() => {
  jest.useFakeTimers()
})

beforeEach(() => {
  Services.services = []
  Services.configure(LogService, undefined, instance(mock<LogService>()))
})