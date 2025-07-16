import { instance, mock, when } from 'ts-mockito'
import TarkovValuesMock from '../../../public/data/tarkov-values.json'
import { ITarkovValues } from '../../models/configuration/ITarkovValues'
import { TarkovValuesService } from '../../services/TarkovValuesService'
import Services from '../../services/repository/Services'

export function useTarkovValuesServiceMock(): void {
  const tarkovValuesServiceMock = mock<TarkovValuesService>()
  when(tarkovValuesServiceMock.values).thenReturn(TarkovValuesMock as ITarkovValues)

  Services.configure(TarkovValuesService, undefined, instance(tarkovValuesServiceMock))
}