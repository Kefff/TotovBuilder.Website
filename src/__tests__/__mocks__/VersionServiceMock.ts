import { instance, mock, when } from 'ts-mockito'
import { VersionService } from '../../services/VersionService'
import Services from '../../services/repository/Services'
import Migrations from '../../utils/migrations/Migrations'

export function useVersionServiceMock(): void {
  const versionServiceMock = mock<VersionService>()
  when(versionServiceMock.getVersionAsync()).thenResolve('1.0.0')

  Migrations.splice(0)

  Services.configure(VersionService, undefined, instance(versionServiceMock))
}