/**
 * Represents arguments to pass to the PrimeVue tooltip directive.
 */
export class DirectiveArguments {
  event: 'focus' | undefined
  position: 'bottom' | 'left' | 'right' | 'top'

  constructor(position: 'bottom' | 'left' | 'right' | 'top', event: 'focus' | undefined) {
    this.event = event
    this.position = position
  }
}