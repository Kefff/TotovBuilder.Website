import { useBreakpoints, useMediaQuery, useScrollLock, useSwipe, UseSwipeDirection } from '@vueuse/core'
import { computed, ComputedRef, Ref, ShallowRef } from 'vue'
import vueI18n from '../plugins/vueI18n'
import { LogService } from '../services/LogService'
import { NotificationService, NotificationType } from '../services/NotificationService'
import Services from '../services/repository/Services'

/**
 * Represents an utility class for manipulating the web browser.
 */
export default class WebBrowserUtils {
  /**
   * Default length by which the target must be moved for the swipe action to be triggered when swipping ends.
   */
  private static _swipeDefaultActionTriggerLength = 50

  /**
   * Default length by which the target can be moved before being block when it cannot be swipped to a direction.
   */
  private static _swipeDefaultBlockLength = 50

  /**
   * Default length required to have been swipped before the target starts to be moved.
   **/
  private static _swipeDefaultThresholdLength = 50

  /**
   * Gets the breakpoints used by CSS media queries.
   */
  public static get breakpoints(): Breakpoints {
    return {
      smartphonePortrait: 0,
      smartphoneLandscape: 481,
      tabletPortrait: 768,
      tabletLandscape: 1050,
      pc: 1350,
      pcLarge: 1800
    }
  }

  /**
   * Copies a text to clipboard.
   * @param textToCopy - Text to copy.
   */
  public static async copyToClipboardAsync(textToCopy: string): Promise<void> {
    await navigator.clipboard.writeText(textToCopy)
      .then(() => {
        Services.get(NotificationService).notify(NotificationType.information, vueI18n.t('message.copied'))
      })
      .catch(() => {
        Services.get(LogService).logError('message.copyError')
        Services.get(NotificationService).notify(NotificationType.error, vueI18n.t('message.copyError'))
      })
  }

  /**
   * Gets reactive screen properties.
   * @param customBreakpoints - Custom breakpoints used instead of standard ones.
   * @returns Reactive screen properties.
   */
  public static getScreenSize(): ScreenSizes {
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


  /**
   * Gets reactive swipe properties.
   * @param options - Swipe options.
   * @returns Reactive swipe properties.
   */
  public static getSwipe(options: SwipeOptions): { isSwiping: Ref<boolean> } {
    const isScrollLocked = useScrollLock(document.getElementById('app'))
    const { direction, isSwiping, lengthX } = useSwipe(
      options.target,
      {
        onSwipeStart: () => isScrollLocked.value = true,
        onSwipe: () => this.onSwipe(options, direction.value, lengthX.value),
        onSwipeEnd: (e: TouchEvent, d: UseSwipeDirection) => {
          this.onSwipeEnd(options, d, lengthX.value)
          isScrollLocked.value = false
        },
        threshold: options.threshold ?? 50
      })

    return { isSwiping }
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
   * Reacts to an element being swipped.
   *
   * Calculates the left position used to visually move the element while it is being swipped.
   * @param options - Swipe options.
   * @param direction - Swipe direction.
   * @param lengthX - Swipe length.
   */
  private static onSwipe(options: SwipeOptions, direction: UseSwipeDirection, lengthX: number): void {
    if (direction !== 'left' && direction !== 'right') {
      return
    }

    const blockLength = options.blockLength ?? this._swipeDefaultBlockLength
    const threshold = options.threshold ?? this._swipeDefaultThresholdLength
    let left = 0

    if (direction === 'left' && lengthX > threshold) {
      const canSwipeLeft = options.canSwipeLeft?.value ?? true
      left = -lengthX + threshold

      if (!canSwipeLeft && left < -blockLength) {
        left = -blockLength
      }
    } else if (lengthX < -threshold) {
      const canSwipeRight = options.canSwipeRight?.value ?? true
      left = -(lengthX + threshold)

      if (!canSwipeRight && left > blockLength) {
        left = blockLength
      }
    }

    options.targetLeftPosition.value = `${left}px`
  }

  /**
   * Reacts to an element being swipped.
   *
   * Checks whether the length required to execute the swipe action is reached and executes the action when this is the case.
   * @param options - Swipe options.
   * @param direction - Swipe direction.
   * @param lengthX - Swipe length.
   */
  private static onSwipeEnd(options: SwipeOptions, direction: UseSwipeDirection, lengthX: number): void {
    const actionTriggerLength = options.actionTriggerLength ?? this._swipeDefaultActionTriggerLength
    const threshold = options.threshold ?? this._swipeDefaultThresholdLength
    let canTriggerAction
    let left

    if (direction === 'left' && lengthX > threshold) {
      const canSwipeLeft = options.canSwipeLeft?.value ?? true
      left = -lengthX + threshold
      canTriggerAction = canSwipeLeft && left < -actionTriggerLength
    } else if (lengthX < -threshold) {
      const canSwipeRight = options.canSwipeRight?.value ?? true
      left = -(lengthX + threshold)
      canTriggerAction = canSwipeRight && left > actionTriggerLength
    }

    if (canTriggerAction) {
      options.action(direction)
    }

    options.targetLeftPosition.value = '0'
  }
}

/**
 * Represents breakpoints for responsiveness.
 */
export type Breakpoints = {
  smartphonePortrait: number,
  smartphoneLandscape: number,
  tabletPortrait: number,
  tabletLandscape: number,
  pc: number,
  pcLarge: number
}

/**
 * Represents screen sizes for responsiveness.
 */
type ScreenSizes = {
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
}

type SwipeOptions = {
  /**
   * Action to execute when swipping ends and the action trigger length has been reached.
   * @param direction - Swipe direction.
   */
  action: (direction: UseSwipeDirection) => void,

  /**
   * Length requied to have been swipped to trigger the action when swipping ends.
   */
  actionTriggerLength?: number,

  /**
   * Length by which the target can be moved before being block when it cannot be swipped to a direction.
   */
  blockLength?: number,

  /**
   * Indicates whether the user can swipe to the left.
   */
  canSwipeLeft?: ComputedRef<boolean>

  /**
   * Indicates whether the user can swipe to the right.
   */
  canSwipeRight?: ComputedRef<boolean>

  /**
   * Element being swipped.
   */
  target: Readonly<ShallowRef<HTMLDivElement | null>>,

  /**
   * Left position of the target that is updated while the target is being swipped.
   */
  targetLeftPosition: Ref<string>,

  /**
   * Length required to have been swipped before the target starts to be moved.
   */
  threshold?: number
}