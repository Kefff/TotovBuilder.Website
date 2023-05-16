import { instance, mock, spy, verify } from 'ts-mockito'
import Services from '../../../services/repository/Services'
import Configuration from '../../../../test-data/configuration.json'

beforeEach(() => Services.services = [])

class TestService1 { }
class TestService2 { }
class TestService3 { }

describe('configure', () => {
  it('should configure a new service', () => {
    // Act
    Services.configure(TestService1)

    // Assert
    expect(Services.services).toHaveLength(1)
    expect(new Services.services[0].type()).toBeInstanceOf(TestService1)
    expect(Services.services[0].instance).toBeUndefined()
    expect(Services.services[0].name).toBe('TestService1')
  })

  it('should configure a new service with a custom name', () => {
    // Act
    Services.configure(TestService1, 'TestService')

    // Assert
    expect(Services.services).toHaveLength(1)
    expect(new Services.services[0].type()).toBeInstanceOf(TestService1)
    expect(Services.services[0].instance).toBeUndefined()
    expect(Services.services[0].name).toBe('TestService')
  })

  it('should replace an already configured service', () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, 'warn') // Services cannot use the LogService so it writes warnings directly to the console. Seems like mockito doesn't work anymore here (https://github.com/nrwl/nx/issues/3129)

    Services.configure(TestService1)
    Services.configure(TestService2)
    const mockedInstance = instance(mock<TestService2>())

    // Act
    Configuration.VITE_WARN_WHEN_SERVICE_REPLACED = 'true'
    Services.configure(TestService3, 'TestService1')
    Configuration.VITE_WARN_WHEN_SERVICE_REPLACED = 'false'
    Services.configure(TestService2, undefined, mockedInstance)

    // Assert
    expect(consoleSpy).toHaveBeenCalledTimes(1)
    expect(Services.services).toHaveLength(2)
    expect(new Services.services[0].type()).toBeInstanceOf(TestService3)
    expect(Services.services[0].instance).toBeUndefined()
    expect(Services.services[0].name).toBe('TestService1')
    expect(new Services.services[1].type()).toBeInstanceOf(TestService2)
    expect(Services.services[1].instance).toBe(mockedInstance)
    expect(Services.services[1].name).toBe('TestService2')
  })
})

describe('get', () => {
  it('should get a configured service', () => {
    // Arrange
    Services.configure(TestService1)

    // Act
    const service = Services.get(TestService1)

    // Assert
    expect(service).toBeInstanceOf(TestService1)
  })

  it('should fail when the service not configured.', () => {
    // Act
    const test = () => Services.get(TestService1)

    // Assert
    expect(test).toThrow('Service "TestService1" not configured.')
  })
})

describe('getByName', () => {
  it('should get a configured service by its name', () => {
    // Arrange
    Services.configure(TestService1, 'TestService')

    // Act
    const service = Services.getByName<TestService1>('TestService')

    // Assert
    expect(service).toBeInstanceOf(TestService1)
  })

  it('should fail when the service is not configured', () => {
    // Act
    const test = () => Services.getByName<TestService1>('TestService')

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

describe('setInitializationFinished', () => {
  it('should indicate that initialization has ended and emit the initialized event', () => {
    // Arrange
    const emitterSpy = spy(Services.emitter)

    // Act
    Services.setInitializationFinished()

    // Assert
    expect(Services.isInitializing).toBe(false)
    verify(emitterSpy.emit('initialized')).once()
  })
})