import { instance, mock, when } from 'ts-mockito'
import Services from '../services/repository/Services'
import { VersionService } from '../services/VersionService'

export function useVersionServiceMock(): void {
  const versionServiceMock = mock<VersionService>()
  when(versionServiceMock.getCurrentVersion()).thenReturn(Promise.resolve('1.0.0'))

  Services.configure(VersionService, undefined, instance(versionServiceMock))
}