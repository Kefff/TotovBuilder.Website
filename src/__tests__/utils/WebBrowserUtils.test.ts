import { MaybeRefOrGetter } from '@vueuse/core'
import { anything, instance, mock, spy, verify, when } from 'ts-mockito'
import { describe, expect, it, vi } from 'vitest'
import { ComputedRef, Ref, ref } from 'vue'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import Services from '../../services/repository/Services'
import WebBrowserUtils from '../../utils/WebBrowserUtils'

describe('WebBrowserUtils', () => {
  describe('copyToClipboardAsync', () => {
    it('should copy a text to clipboard and display a success notification', async () => {
      // Arrange
      const notificationServiceMock = mock<NotificationService>()
      Services.configure(NotificationService, undefined, instance(notificationServiceMock))

      // Act
      await WebBrowserUtils.copyToClipboardAsync('Hello')
      const copiedText = await navigator.clipboard.readText()

      // Assert
      expect(copiedText).toBe('Hello')
      verify(notificationServiceMock.notify(NotificationType.information, 'Copied to clipboard.')).once()
    })

    it('should log and display an error notification when failing', async () => {
      // Arrange
      const notificationServiceMock = mock<NotificationService>()
      Services.configure(NotificationService, undefined, instance(notificationServiceMock))

      const clipboardSpy = spy(navigator.clipboard)
      when(clipboardSpy.writeText(anything())).thenReject()

      // Act
      await WebBrowserUtils.copyToClipboardAsync('Hello')

      // Assert
      verify(notificationServiceMock.notify(NotificationType.error, 'Error while copying to clipboard.')).once()
      verify(clipboardSpy.writeText('Hello')).once()
    })
  })

  describe('getScreenSize', () => {
    it.each([[true], [false]])('should get screen size variables (%s)', async (isSmaller) => {
      // Arrange
      vi.mock('@vueuse/core')
      const vueUseMock = await import('@vueuse/core')
      const useBreakpointsMock = vueUseMock.useBreakpoints = vi.fn(() => ({
        smaller: () => ref(isSmaller)
      } as unknown as Record<string, Ref<boolean, boolean>> & {
        greaterOrEqual: (k: MaybeRefOrGetter<string>) => Ref<boolean, boolean>
        smallerOrEqual: (k: MaybeRefOrGetter<string>) => Ref<boolean, boolean>
        greater(k: MaybeRefOrGetter<string>): Ref<boolean, boolean>
        smaller(k: MaybeRefOrGetter<string>): Ref<boolean, boolean>
        between(a: MaybeRefOrGetter<string>, b: MaybeRefOrGetter<string>): Ref<boolean, boolean>
        isGreater(k: MaybeRefOrGetter<string>): boolean
        isGreaterOrEqual(k: MaybeRefOrGetter<string>): boolean
        isSmaller(k: MaybeRefOrGetter<string>): boolean
        isSmallerOrEqual(k: MaybeRefOrGetter<string>): boolean
        isInBetween(a: MaybeRefOrGetter<string>, b: MaybeRefOrGetter<string>): boolean
        current: () => ComputedRef<string[]>
        active(): ComputedRef<string | undefined>
      }))

      // Act
      const screenSize = WebBrowserUtils.getScreenSize()

      // Assert
      expect(screenSize.isPc.value).toBe(false)
      expect(screenSize.isPcLarge.value).toBe(!isSmaller)
      expect(screenSize.isPcOrLarger.value).toBe(!isSmaller)
      expect(screenSize.isPcOrSmaller.value).toBe(isSmaller)
      expect(screenSize.isSmartphoneLandscape.value).toBe(false)
      expect(screenSize.isSmartphoneLandscapeOrLarger.value).toBe(!isSmaller)
      expect(screenSize.isSmartphoneLandscapeOrSmaller.value).toBe(isSmaller)
      expect(screenSize.isSmartphonePortrait.value).toBe(isSmaller)
      expect(screenSize.isTabletLandscape.value).toBe(false)
      expect(screenSize.isTabletLandscapeOrLarger.value).toBe(!isSmaller)
      expect(screenSize.isTabletLandscapeOrSmaller.value).toBe(isSmaller)
      expect(screenSize.isTabletPortrait.value).toBe(false)
      expect(screenSize.isTabletPortraitOrLarger.value).toBe(!isSmaller)
      expect(screenSize.isTabletPortraitOrSmaller.value).toBe(isSmaller)
      expect(useBreakpointsMock).toHaveBeenCalled()
    })
  })

  describe('getScrollableParentElement', () => {
    it.each([[null], [undefined]])('should return undefined when no expected scrollable parent element is found', (greatGrandParentElement: null | undefined) => {
      // Arrange
      const emptyClassListMock = mock<DOMTokenList>()
      when(emptyClassListMock.contains(anything())).thenReturn(false)

      const grandParentElement = {
        classList: instance(emptyClassListMock),
        parentElement: greatGrandParentElement
      } as HTMLElement
      const parentElement = {
        classList: instance(emptyClassListMock),
        parentElement: grandParentElement
      } as HTMLElement

      // Act
      const scrollableParentElement = WebBrowserUtils.getScrollableParentElement(parentElement)

      // Assert
      expect(scrollableParentElement).toBeUndefined()
    })

    it('should return the sidebar content div when in a sidebar', () => {
      // Arrange
      const matchingClassListMock = mock<DOMTokenList>()
      when(matchingClassListMock.contains('p-sidebar-content')).thenReturn(true)

      const emptyClassListMock = mock<DOMTokenList>()
      when(emptyClassListMock.contains('p-sidebar-content')).thenReturn(false)

      const greatGrandParentElement = {
        classList: instance(emptyClassListMock),
        id: 'app'
      } as HTMLElement

      const grandParentElement = {
        classList: instance(matchingClassListMock),
        parentElement: greatGrandParentElement
      } as HTMLElement

      const parentElement = {
        classList: instance(emptyClassListMock),
        parentElement: grandParentElement
      } as HTMLElement

      // Act
      const scrollableParentElement = WebBrowserUtils.getScrollableParentElement(parentElement)

      // Assert
      expect(scrollableParentElement).toStrictEqual({
        isInGlobalSidebar: true,
        scrollableParentElement: grandParentElement
      })
    })

    it('should return the app div', () => {
      // Arrange
      const emptyClassListMock = mock<DOMTokenList>()
      when(emptyClassListMock.contains('p-sidebar-content')).thenReturn(false)

      const greatGrandParentElement = {
        classList: instance(emptyClassListMock),
        id: 'app'
      } as HTMLElement

      const grandParentElement = {
        classList: instance(emptyClassListMock),
        parentElement: greatGrandParentElement
      } as HTMLElement

      const parentElement = {
        classList: instance(emptyClassListMock),
        parentElement: grandParentElement
      } as HTMLElement

      // Act
      const scrollableParentElement = WebBrowserUtils.getScrollableParentElement(parentElement)

      // Assert
      expect(scrollableParentElement).toStrictEqual({
        isInGlobalSidebar: false,
        scrollableParentElement: greatGrandParentElement
      })
    })
  })

  describe('isTouchScreen', () => {
    it.each([[true], [false]])('should indicate whether the screen is a touch screen (%s)', async (expected: boolean) => {
      // Arrange
      vi.mock('@vueuse/core')
      const vueUseMock = await import('@vueuse/core')
      const useMediaQueryMock = vueUseMock.useMediaQuery = vi.fn(() => ref(expected))

      // Act
      const isTouchScreen = WebBrowserUtils.isTouchScreen()

      // Assert
      expect(isTouchScreen.value).toBe(expected)
      expect(useMediaQueryMock).toHaveBeenCalledWith('(hover: none)')

      // Clean
      vi.resetAllMocks()
    })
  })
})