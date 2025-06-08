import { TinyEmitter } from 'tiny-emitter'
import { useRouter } from 'vue-router'
import { IGlobalSidebar } from '../models/utils/IGlobalSidebar'
import { GlobalSidebarDisplayedComponentParameters, IGlobalSidebarOptions } from '../models/utils/IGlobalSidebarOptions'

/**
 * Represents a service responsible for managing a GlobalSidebarComponent.
 */
export class GlobalSidebarService {
  /**
   * Name of the event fired when a sidebar is closed.
   */
  public static closedGlobalSidebarEvent = 'closedGlobalSidebar'

  /**
   * Name of the event fired when a sidebar is being closed.
   */
  public static closingGlobalSidebarEvent = 'closingGlobalSidebar'

  /**
   * Name of the event fired to ask a global sidebar to open.
   */
  public static openedGlobalSidebarEvent = 'openedGlobalSidebar'

  /**
   * List of displayed sidebars.
   */
  public displayedSidebars: { [key: number]: IGlobalSidebar } = {}

  /**
   * Event emitter used to open and close a global sidebar.
   */
  public emitter = new TinyEmitter()

  /**
   * Counter for identifiers.
   */
  private lastIdentifier = -1

  /**
   * Initializes a new instance of the GlobalSidebarService class.
   */
  public constructor() {
    const router = useRouter()
    router.beforeEach(() => this.onRouteChange())
  }

  /**
   * Closes a global sidebar.
   * @param identifier- Identifier of the sidebar to close.
   */
  public close(identifier: number): void {
    this.emitter.emit(GlobalSidebarService.closingGlobalSidebarEvent, identifier)
  }

  /**
   * Displays a global sidebar.
   * @param options - Options.
   */
  public display(options: IGlobalSidebarOptions): void {
    this.lastIdentifier += 1
    const identifier = this.lastIdentifier
    this.displayedSidebars[identifier] = { identifier, options }

    this.emitter.emit(GlobalSidebarService.openedGlobalSidebarEvent)
  }

  /**
   * Executes the actions registered to be executed when a sidebar is closed.
   * @param identifier - Identifier of the sidebar being closed.
   * @param updatedParameters - Updated parameters of the sidebar.
   */
  public async executeOnCloseActionsAsync(identifier: number, updatedParameters?: GlobalSidebarDisplayedComponentParameters): Promise<void> {
    const onCloseAction = this.displayedSidebars[identifier]?.options.onCloseAction

    if (onCloseAction != null) {
      await onCloseAction(updatedParameters)
    }

    delete this.displayedSidebars[identifier]
    this.emitter.emit(GlobalSidebarService.closedGlobalSidebarEvent)
  }

  /**
   * Indicates whether a global sidebar is opened.
   * @returns `true` when a global sidebar is opened; otherwise `false`.
   */
  public isDisplayed(): boolean {
    return Object.keys(this.displayedSidebars).length > 0
  }

  /**
   * Registers an action to be executed when a global sidebar is closed.
   * @param identifier - Identifier of the sidebar being closed.
   * @param action - Action.
   */
  public setOnCloseAction(identifier: number, action: (updatedParameters?: GlobalSidebarDisplayedComponentParameters) => void | Promise<void>): void {
    const displayedSidebar = this.displayedSidebars[identifier]

    if (displayedSidebar != null) {
      displayedSidebar.options.onCloseAction = action
    }
  }

  /**
   * Reacts to a route being changed.
   *
   * When one or more sidebars are open, cancels the navigation and closes the last sidebar.
   */
  /* v8 ignore start */ // Justification : could not find a way to mock VueRouter and be able to call this code
  private onRouteChange(): boolean {
    if (!this.isDisplayed()) {
      return true
    }

    let lastIdentifier: number = -1

    for (const identifier of Object.keys(this.displayedSidebars)) {
      const castedIdentifier = Number(identifier)

      if (castedIdentifier > lastIdentifier) {
        lastIdentifier = castedIdentifier
      }
    }

    this.close(lastIdentifier)

    return false
  }
  /* v8 ignore stop */
}