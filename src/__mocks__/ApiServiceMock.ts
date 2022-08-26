import { anyString, instance, mock, when } from 'ts-mockito'
import { ApiService } from '../services/ApiService'
import Services from '../services/repository/Services'
import Result from '../utils/Result'

export function useApiServiceMock<T>(data: T): void {
  const apiServiceMock = mock<ApiService>()
  when(apiServiceMock.get<T>(anyString())).thenReturn(Promise.resolve(Result.ok(data)))

  Services.configure(ApiService, undefined, instance(apiServiceMock))
}