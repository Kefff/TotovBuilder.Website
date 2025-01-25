import { useBreakpoints, useMediaQuery } from '@vueuse/core'
import { computed, ComputedRef, Ref } from 'vue'

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
   * Gets reactive screen properties.
   * @returns Reactive screen properties.
   */
  public static getScreenSize(): {
    isPc: ComputedRef<boolean>,
    isPcLarge: ComputedRef<boolean>,
    isPcOrLarger: ComputedRef<boolean>,
    isPcOrSmaller: Ref<boolean>,
    isSmartphoneLandscape: ComputedRef<boolean>,
    isSmartphoneLandscapeOrLarger: ComputedRef<boolean>,
    isSmartphoneLandscapeOrSmaller: Ref<boolean>,
    isSmartphonePortrait: Ref<boolean>,
    isTabletLandscapeOrLarger: ComputedRef<boolean>,
    isTabletLandscape: ComputedRef<boolean>,
    isTabletLandscapeOrSmaller: Ref<boolean>,
    isTabletPortrait: ComputedRef<boolean>,
    isTabletPortraitOrLarger: ComputedRef<boolean>,
    isTabletPortraitOrSmaller: Ref<boolean>
  } {
    const breakpoints = useBreakpoints(WebBrowserUtils.breakpoints)

    const isPcOrSmaller = breakpoints.smaller('pcLarge')
    const isSmartphoneLandscapeOrSmaller = breakpoints.smaller('tabletPortrait')
    const isSmartphonePortrait = breakpoints.smaller('smartphoneLandscape')
    const isTabletLandscapeOrSmaller = breakpoints.smaller('pc')
    const isTabletPortraitOrSmaller = breakpoints.smaller('tabletLandscape')

    const isPc = computed(() => isPcOrSmaller.value && !isTabletLandscapeOrSmaller.value)
    const isPcLarge = computed(() => !isPcOrSmaller.value
      && !isSmartphoneLandscapeOrSmaller.value
      && !isSmartphonePortrait.value
      && !isTabletLandscapeOrSmaller.value
      && !isTabletPortraitOrSmaller.value)
    const isTabletLandscape = computed(() => isTabletLandscapeOrSmaller.value && !isTabletPortraitOrSmaller.value)
    const isTabletPortrait = computed(() => isTabletPortraitOrSmaller.value && !isSmartphoneLandscapeOrSmaller.value)

    const isPcOrLarger = computed(() => isPc.value || isPcLarge.value)
    const isSmartphoneLandscape = computed(() => isSmartphoneLandscapeOrSmaller.value && !isSmartphonePortrait.value)
    const isSmartphoneLandscapeOrLarger = computed(() => isSmartphoneLandscape.value || isTabletPortraitOrLarger.value)
    const isTabletLandscapeOrLarger = computed(() => isTabletLandscape.value || isPcOrLarger.value)
    const isTabletPortraitOrLarger = computed(() => isTabletPortrait.value || isTabletLandscapeOrLarger.value)

    return {
      isPc,
      isPcLarge,
      isPcOrLarger,
      isPcOrSmaller,
      isSmartphoneLandscape,
      isSmartphoneLandscapeOrLarger,
      isSmartphoneLandscapeOrSmaller,
      isSmartphonePortrait,
      isTabletLandscapeOrLarger,
      isTabletLandscape,
      isTabletLandscapeOrSmaller,
      isTabletPortrait,
      isTabletPortraitOrLarger,
      isTabletPortraitOrSmaller
    }
  }

  /**
   * Indicates whether the screen is a touch screen.
   * @returns `true` when the screen is a touch screen; otherwise `false`.
   */
  public static isTouchScreen(): Ref<boolean> {
    const isTouchScreen = useMediaQuery('(hover: none)') // cf. https://stackoverflow.com/a/63666289

    return isTouchScreen
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