
/**
 * Represents an utility class for manipulating the web browser.
 */
export default class WebBrowserUtils {
  /**
   * Gets the breakpoints used by CSS media queries.
   */
  public static get breakpoints() {
    return {
      smartphonePortrait: 0,
      smartphoneLandscape: 481,
      tabletPortrait: 768,
      tabletLandscape: 992,
      pc: 1300
    }
  }
}