/**
 * Represents arguments to pass to the PrimeVue tooltip directive.
 */
export class DirectiveArguments {
  /**
   * Event that triggers the tooltip. If undefined, the tooltip is displayed when hovering the element.
   */
  event: 'focus' | undefined

  /**
   * Position of the tooltip.
   */
  position: 'bottom' | 'left' | 'right' | 'top'

  constructor(position: 'bottom' | 'left' | 'right' | 'top', event: 'focus' | undefined) {
    this.event = event
    this.position = position
  }
}