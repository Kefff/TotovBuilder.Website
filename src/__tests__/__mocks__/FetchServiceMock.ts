import { anything, instance, mock, when } from 'ts-mockito'
import { FetchService } from '../../services/FetchService'
import Services from '../../services/repository/Services'

export function useFetchServiceMock<T>(data: T): void {
  const fetchServiceMock = mock<FetchService>()
  when(fetchServiceMock.fetchAsync<T>(anything())).thenResolve(data)
  when(fetchServiceMock.fetchWithRetryAsync<T>(anything())).thenResolve(data)

  Services.configure(FetchService, undefined, instance(fetchServiceMock))
}