import { anything, instance, mock, spy, verify, when } from 'ts-mockito'
import { AmmunitionReaderService } from '../../../services/readers/AmmunitionReaderService'
import { ContainerReaderService } from '../../../services/readers/ContainerReaderService'
import { VestReaderService } from '../../../services/readers/VestReaderService'
import Services from '../../../services/repository/Services'
import Configuration from '../../../../test-data/configuration.json'

beforeEach(() => Services.services = [])

describe('configure', () => {
  it('should configure a new service', () => {
    // Act
    Services.configure(AmmunitionReaderService)

    // Assert
    expect(Services.services).toHaveLength(1)
    expect(new Services.services[0].type()).toBeInstanceOf(AmmunitionReaderService)
    expect(Services.services[0].instance).toBeUndefined()
    expect(Services.services[0].name).toBe('AmmunitionReaderService')
  })

  it('should configure a new service with a custom name', () => {
    // Act
    Services.configure(AmmunitionReaderService, 'TestService')

    // Assert
    expect(Services.services).toHaveLength(1)
    expect(new Services.services[0].type()).toBeInstanceOf(AmmunitionReaderService)
    expect(Services.services[0].instance).toBeUndefined()
    expect(Services.services[0].name).toBe('TestService')
  })

  it('should replace an already configured service', () => {
    // Arrange
    const consoleSpy = spy(console) // Services cannot use the LogService so it writes warnings directly to the console
    when(consoleSpy.warn(anything())).thenReturn()
    Services.configure(ContainerReaderService)
    Services.configure(AmmunitionReaderService)
    const mockedInstance = instance(mock<AmmunitionReaderService>())

    // Act
    Configuration.VITE_WARN_WHEN_SERVICE_REPLACED = 'true'
    Services.configure(VestReaderService, 'ContainerReaderService')
    Configuration.VITE_WARN_WHEN_SERVICE_REPLACED = 'false'
    Services.configure(AmmunitionReaderService, undefined, mockedInstance)

    // Assert
    verify(consoleSpy.warn(anything())).once()
    expect(Services.services).toHaveLength(2)
    expect(new Services.services[0].type()).toBeInstanceOf(VestReaderService)
    expect(Services.services[0].instance).toBeUndefined()
    expect(Services.services[0].name).toBe('ContainerReaderService')
    expect(new Services.services[1].type()).toBeInstanceOf(AmmunitionReaderService)
    expect(Services.services[1].instance).toBe(mockedInstance)
    expect(Services.services[1].name).toBe('AmmunitionReaderService')
  })
})

describe('get', () => {
  it('should get a configured service', () => {
    // Arrange
    Services.configure(AmmunitionReaderService)

    // Act
    const service = Services.get(AmmunitionReaderService)

    // Assert
    expect(service).toBeInstanceOf(AmmunitionReaderService)
  })

  it('should fail when the service not configured.', () => {
    // Act
    const test = () => Services.get(AmmunitionReaderService)

    // Assert
    expect(test).toThrow('Service "AmmunitionReaderService" not configured.')
  })
})

describe('getByName', () => {
  it('should get a configured service by its name', () => {
    // Arrange
    Services.configure(AmmunitionReaderService, 'TestService')

    // Act
    const service = Services.getByName<AmmunitionReaderService>('TestService')

    // Assert
    expect(service).toBeInstanceOf(AmmunitionReaderService)
  })

  it('should fail when the service is not configured', () => {
    // Act
    const test = () => Services.getByName<AmmunitionReaderService>('TestService')

    // Assert
    expect(test).toThrow('Service "TestService" not configured.')
  })
})

describe('getServiceRepository', () => {
  it('should get the service repository', () => {
    // Act
    const services = Services

    // Assert
    expect(services).toBeDefined()
  })
})