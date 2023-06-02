import { anything, instance, mock, when } from 'ts-mockito'
import Services from '../services/repository/Services'
import { GlobalFilterService } from '../services/GlobalFilterService'

export function useGlobalFilterServiceMock(): void {
  const globalFilterServiceMock = mock<GlobalFilterService>()
  when(globalFilterServiceMock.emitter).thenReturn({
    emit: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    off: jest.fn()
  })
  when(globalFilterServiceMock.isMatchingFilter(anything())).thenReturn(true)

  Services.configure(GlobalFilterService, undefined, instance(globalFilterServiceMock))
}