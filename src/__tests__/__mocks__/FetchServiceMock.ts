import { anyString, instance, mock, when } from 'ts-mockito'
import { FetchService } from '../../services/FetchService'
import Services from '../../services/repository/Services'

export function useFetchServiceMock<T>(data: T): void {
  const fetchServiceMock = mock<FetchService>()
  when(fetchServiceMock.get<T>(anyString())).thenResolve(data)

  Services.configure(FetchService, undefined, instance(fetchServiceMock))
}