import { instance, mock, when } from 'ts-mockito'
import Services from '../../services/repository/Services'
import { TarkovValuesService } from '../../services/TarkovValuesService'
import TarkovValuesMock from '../__data__/tarkov-values.json'
import { ITarkovValues } from '../../models/configuration/ITarkovValues'

export function useTarkovValuesServiceMock(): void {
  const tarkovValuesServiceMock = mock<TarkovValuesService>()
  when(tarkovValuesServiceMock.values).thenReturn(TarkovValuesMock as ITarkovValues)

  Services.configure(TarkovValuesService, undefined, instance(tarkovValuesServiceMock))
}