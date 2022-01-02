import { instance, mock } from 'ts-mockito'
import { LogService } from '../services/LogService'
import Services from '../services/repository/Services'
import { configureServices } from '../servicesConfiguration'

beforeEach(() => {
  Services.services = []
  configureServices()
  Services.configure(LogService, undefined, instance(mock<LogService>()))
})