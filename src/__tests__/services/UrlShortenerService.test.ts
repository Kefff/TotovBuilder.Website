import { anything, instance, mock, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { FetchService } from '../../services/FetchService'
import { LogService } from '../../services/LogService'
import Services from '../../services/repository/Services'
import { UrlShortenerService } from '../../services/UrlShortenerService'
import websiteConfigurationMock from '../__data__/websiteConfigurationMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('UrlShortenerService', () => {
  it('should shorten a URL', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const urlToShorten = 'https://www.totovbuilder.com/s/XQAAAALLBgAAAAAAAABBKEnKkjM2lYkrJxkWGvsWno5Sckyrv4-fRQJfkT1g33VVwznLHK0oo86r-na3Q0zbBjRNIU1YWEAs9Ynlz81oJjWK2xI3T9rl34NnRjnmRadnSQtsd_yXbl14oVXEnZzgnKC7E1B2hC_XUZ6OlJpr4Q_eqwVgzQ6qUYbpsOLouHoSSKLlckAKyXoxSUBBhX_75gjre6sSpxHPRou9u8f-Jygo0B6DYi5rHTmV1f9RDLKTr9trsius9HpGU8rLUUXAzT6eKNSh_kmtsar1JtmIW5mTPYVn-9KMZkmNArnVF1k-x2qdLlDbUd4r8gYF7LeT-kAM0b_WqCp-gtyY-HltQQ_gcio9JKh_prp6PwGgLenL2wKRCnnYVphCUq0u1_Vacj22Lf4bO70ICxbx0Y2RBXGqZxdEMzg7g1l3Qf_-z007SPAecdWqNwQmbXzy7nfcCyMSfvH4GzvLbs8xgLDhhTBJ5UBdyGBk9CZ9Rq_uW7BG6X4cGJgJyEBk5XiU5RzgOFSlfAE3mSgVHj9ZPLhGxb70zhM3kFVdy1ZBUpA4H1J-XqUpeY89RHvGazU27i4d9bU878ncEg-Uz_LpNSvbayJMo0npPc0JTdkWUAS61YO3URzXJj0uv1zlNWeSbNDF-tBeAgjUhTWKMFtvbYPsu6K7tzRgSPg-KhUgt8eFBSRJctMJsuxwNx8JPaJBIuw9Q0B_UIYiejZMxAk2nYKsXcIx_VI0e4Nt5ZEWdCSZC4eMevbe8mps9vBPUs1Aw6421DxtkqmSkRgsJPDw5aaeEQ2aeZXj054i6hRXpHNKULH0KmzZtqM8Qq5BcujjjWFhHQjqm09mC_tq6xYCRcA8SbK2tLrjp98DfkTEx8tTD8nP23zM9kRG0QjGRhwPIRgtTV-g-EpQVT8shFKHg-UWpE-LUYazPLtT-vb6_-InblUL1wvXX0yXlPUw_mPe0RvM2PwsV6W-e4OKiv8whoEbzgzahgpYZsZBXQEDZfWhac_x1Xb8CryQGA7VF3MKMNsm54hjYGJMW2qujwjuEvg6tKqYajk3xsABMIAnSe0m0ivXnjSGhFpZZ2JX5sRK4U6MxV0jXxiF0OSZblrLkb0TT-t-cmWriE576zM2kPs4HxDQ0DlHav8jx1V2T-8n7xf_7wHaBQ'
    const expectedShortenedUrl = `${websiteConfigurationMock.endpointUrlShortener}/wNCBVt`

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.fetchAsync(anything())).thenReturn(Promise.resolve({
      short_url: expectedShortenedUrl
    }))
    Services.configure(FetchService, undefined, instance(fetchServiceMock))

    const services = new UrlShortenerService()

    // Act
    const shortenedUrl = await services.shortenAsync(urlToShorten)

    // Assert
    expect(shortenedUrl).toBe(expectedShortenedUrl)
  })

  it('should return the original URL when it fails', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const logServiceMock = Services.get(LogService)

    const urlToShorten = 'https://www.totovbuilder.com/s/XQAAAALLBgAAAAAAAABBKEnKkjM2lYkrJxkWGvsWno5Sckyrv4-fRQJfkT1g33VVwznLHK0oo86r-na3Q0zbBjRNIU1YWEAs9Ynlz81oJjWK2xI3T9rl34NnRjnmRadnSQtsd_yXbl14oVXEnZzgnKC7E1B2hC_XUZ6OlJpr4Q_eqwVgzQ6qUYbpsOLouHoSSKLlckAKyXoxSUBBhX_75gjre6sSpxHPRou9u8f-Jygo0B6DYi5rHTmV1f9RDLKTr9trsius9HpGU8rLUUXAzT6eKNSh_kmtsar1JtmIW5mTPYVn-9KMZkmNArnVF1k-x2qdLlDbUd4r8gYF7LeT-kAM0b_WqCp-gtyY-HltQQ_gcio9JKh_prp6PwGgLenL2wKRCnnYVphCUq0u1_Vacj22Lf4bO70ICxbx0Y2RBXGqZxdEMzg7g1l3Qf_-z007SPAecdWqNwQmbXzy7nfcCyMSfvH4GzvLbs8xgLDhhTBJ5UBdyGBk9CZ9Rq_uW7BG6X4cGJgJyEBk5XiU5RzgOFSlfAE3mSgVHj9ZPLhGxb70zhM3kFVdy1ZBUpA4H1J-XqUpeY89RHvGazU27i4d9bU878ncEg-Uz_LpNSvbayJMo0npPc0JTdkWUAS61YO3URzXJj0uv1zlNWeSbNDF-tBeAgjUhTWKMFtvbYPsu6K7tzRgSPg-KhUgt8eFBSRJctMJsuxwNx8JPaJBIuw9Q0B_UIYiejZMxAk2nYKsXcIx_VI0e4Nt5ZEWdCSZC4eMevbe8mps9vBPUs1Aw6421DxtkqmSkRgsJPDw5aaeEQ2aeZXj054i6hRXpHNKULH0KmzZtqM8Qq5BcujjjWFhHQjqm09mC_tq6xYCRcA8SbK2tLrjp98DfkTEx8tTD8nP23zM9kRG0QjGRhwPIRgtTV-g-EpQVT8shFKHg-UWpE-LUYazPLtT-vb6_-InblUL1wvXX0yXlPUw_mPe0RvM2PwsV6W-e4OKiv8whoEbzgzahgpYZsZBXQEDZfWhac_x1Xb8CryQGA7VF3MKMNsm54hjYGJMW2qujwjuEvg6tKqYajk3xsABMIAnSe0m0ivXnjSGhFpZZ2JX5sRK4U6MxV0jXxiF0OSZblrLkb0TT-t-cmWriE576zM2kPs4HxDQ0DlHav8jx1V2T-8n7xf_7wHaBQ'

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.fetchAsync(anything())).thenReturn(Promise.resolve(undefined))
    Services.configure(FetchService, undefined, instance(fetchServiceMock))

    const services = new UrlShortenerService()

    // Act
    const shortenedUrl = await services.shortenAsync(urlToShorten)

    // Assert
    expect(shortenedUrl).toBe(urlToShorten)
    verify(logServiceMock.logError(`URL "${urlToShorten}" could not be shortened.`))
  })
})