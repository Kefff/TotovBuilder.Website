/**
 * Represents an utility class for manipulating the web browser.
 */
export default class WebBrowserUtils {
  /**
   * Gets the breakpoints used by CSS media queries.
   */
  public static get breakpoints(): {
    smartphonePortrait: number,
    smartphoneLandscape: number,
    tabletPortrait: number,
    tabletLandscape: number,
    pc: number,
    pcLarge: number
  } {
    return {
      smartphonePortrait: 0,
      smartphoneLandscape: 481,
      tabletPortrait: 768,
      tabletLandscape: 992,
      pc: 1300,
      pcLarge: 1800
    }
  }

  /**
 * Gets the parent element that can be scrolled.
 * It can either be the `p-sidebar-content` div of a global sidebar or the `app` div.
 * @param parentElement - Parent element.
 */
  public static getScrollableParentElement(parentElement: HTMLElement | undefined | null): { isInGlobalSidebar: boolean, scrollableParentElement: HTMLElement } | undefined {
    if (parentElement == null) {
      return undefined
    }

    if (parentElement.classList.contains('p-sidebar-content')) {
      return {
        scrollableParentElement: parentElement,
        isInGlobalSidebar: true
      }
    } else if (parentElement.id === 'app') {
      return {
        scrollableParentElement: parentElement,
        isInGlobalSidebar: false
      }
    }

    const result = this.getScrollableParentElement(parentElement.parentElement)

    return result
  }
}