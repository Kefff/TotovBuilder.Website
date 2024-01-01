import { anyString, instance, mock, when } from 'ts-mockito'
import { FetchService } from '../../services/FetchService'
import Services from '../../services/repository/Services'
import Result from '../../utils/Result'

export function useFetchServiceMock<T>(data: T): void {
  const fetchServiceMock = mock<FetchService>()
  when(fetchServiceMock.get<T>(anyString())).thenReturn(Promise.resolve(Result.ok(data)))

  Services.configure(FetchService, undefined, instance(fetchServiceMock))
}