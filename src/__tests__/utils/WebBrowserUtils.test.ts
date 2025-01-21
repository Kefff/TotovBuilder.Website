import { anything, instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import WebBrowserUtils from '../../utils/WebBrowserUtils'

describe('WebBrowserUtils', () => {
  describe('getScrollableParentElement()', () => {
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
})