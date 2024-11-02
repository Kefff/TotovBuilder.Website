import { TinyEmitter } from 'tiny-emitter'
import { useRouter } from 'vue-router'
import { GlobalSidebarComponent, GlobalSidebarDisplayedComponentParameters, IGlobalSidebarOptions } from '../models/utils/IGlobalSidebarOptions'

/**
 * Represents a service responsible for managing a GlobalSidebarComponent.
 */
export class GlobalSidebarService {
  /**
   * Name of the event fired to ask a global sidebar to close.
   */
  public static closeGlobalSidebarEvent = 'closeGlobalSidebar'

  /**
   * Name of the event fired to ask a global sidebar to open.
   */
  public static openGlobalSidebarEvent = 'openGlobalSidebar'

  /**
   * Event emitter used to open and close a global sidebar.
   */
  public emitter = new TinyEmitter()

  /**
   * List of displayed sidebars.
   */
  private displayedSidebar: GlobalSidebarComponent[] = []

  /**
   * Actions to execute when a global sidebar is closed.
   */
  private onCloseActions: { type: GlobalSidebarComponent, action: (updatedParameters?: GlobalSidebarDisplayedComponentParameters) => void | Promise<void> }[] = []

  /**
   * Initializes a new instance of the GlobalSidebarService class.
   */
  public constructor() {
    const router = useRouter()
    router.beforeEach(() => this.onRouteChange())
  }

  /**
   * Closes a global sidebar.
   * @param displayedComponentType- Type of component displayed in the global sidebar to close.
   */
  public close(displayedComponentType: GlobalSidebarComponent): void {
    this.emitter.emit(GlobalSidebarService.closeGlobalSidebarEvent, displayedComponentType)
  }

  /**
   * Displays a global sidebar.
   * @param options - Options.
   */
  public display(options: IGlobalSidebarOptions): void {
    if (this.displayedSidebar.length === 3) {
      return
    }

    this.displayedSidebar.push(options.displayedComponentType)

    if (options.onCloseAction != null) {
      this.registerOnCloseAction(options.displayedComponentType, options.onCloseAction)
    }

    this.emitter.emit(GlobalSidebarService.openGlobalSidebarEvent, options, this.displayedSidebar.length)
  }

  /**
   * Executes the actions registered to be executed when a sidebar is closed.
   * @param displayedComponentType - Type of component displayed in the closed sidebar.
   */
  public async executeOnCloseActionsAsync(displayedComponentType: GlobalSidebarComponent, updatedParameters?: GlobalSidebarDisplayedComponentParameters): Promise<void> {
    for (const onCloseAction of this.onCloseActions) {
      if (onCloseAction.type === displayedComponentType) {
        await onCloseAction.action(updatedParameters)
      }
    }

    this.displayedSidebar = this.displayedSidebar.filter(ds => ds !== displayedComponentType)
    this.onCloseActions = this.onCloseActions.filter(a => a.type !== displayedComponentType)
  }

  /**
   * Indicates whether a global sidebar is opened.
   * @returns true when a global sidebar is opened; otherwise false.
   */
  public isDisplayed(): boolean {
    return this.displayedSidebar.length > 0
  }

  /**
   * Registers an action to be executed when a global sidebar is closed.
   * @param displayedComponentType - Type of component displayed in the closed sidebar.
   * @param action - Action.
   */
  public registerOnCloseAction(displayedComponentType: GlobalSidebarComponent, action: (updatedParameters?: GlobalSidebarDisplayedComponentParameters) => void | Promise<void>): void {
    this.onCloseActions.push({ action, type: displayedComponentType })
  }

  /**
   * Reacts to a route being changed.
   *
   * When a sidebar is open, cancels the navigation and closes the sidebar.
   */
  /* v8 ignore start */ // Justification : could not find a way to mock VueRouter and be able to call this code
  private onRouteChange(): boolean {
    if (this.isDisplayed()) {
      this.close(this.displayedSidebar[this.displayedSidebar.length - 1])

      return false
    }

    return true
  }
  /* v8 ignore stop */
}