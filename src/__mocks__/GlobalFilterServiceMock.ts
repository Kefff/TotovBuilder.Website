import { anything, instance, mock, when } from 'ts-mockito'
import Services from '../services/repository/Services'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { vi } from 'vitest'

export function useGlobalFilterServiceMock(): void {
  const globalFilterServiceMock = mock<GlobalFilterService>()
  when(globalFilterServiceMock.emitter).thenReturn({
    emit: vi.fn(),
    on: vi.fn(),
    once: vi.fn(),
    off: vi.fn()
  })
  when(globalFilterServiceMock.isMatchingFilter(anything())).thenReturn(true)

  Services.configure(GlobalFilterService, undefined, instance(globalFilterServiceMock))
}