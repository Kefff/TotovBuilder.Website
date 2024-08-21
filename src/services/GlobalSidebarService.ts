import { TinyEmitter } from 'tiny-emitter'
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
   * Level of last sidebar displayed.
   */
  private currentLevel = 0

  /**
   * Name of the event fired to ask a global sidebar to open.
   */
  public static openGlobalSidebarEvent = 'openGlobalSidebar'

  /**
   * Event emitter used to open and close a global sidebar.
   */
  public emitter = new TinyEmitter()

  /**
   * Actions to execute when a global sidebar is closed.
   */
  private onCloseActions: { type: GlobalSidebarComponent, action: (updatedParameters?: GlobalSidebarDisplayedComponentParameters) => void | Promise<void> }[] = []

  /**
   * Closes a global sidebar.
   * @param displayedComponentType- Type of component displayed in the global sidebar to close.
   */
  public close(displayedComponentType: GlobalSidebarComponent) {
    this.emitter.emit(GlobalSidebarService.closeGlobalSidebarEvent, displayedComponentType)
  }

  /**
   * Displays a global sidebar.
   * @param options - Options.
   */
  public display(options: IGlobalSidebarOptions) {
    if (this.currentLevel === 3) {
      return
    }

    this.currentLevel++

    if (options.onCloseAction != null) {
      this.registerOnCloseAction(options.displayedComponentType, options.onCloseAction)
    }

    this.emitter.emit(GlobalSidebarService.openGlobalSidebarEvent, options, this.currentLevel)
  }

  /**
   * Executes the actions registered to be executed when a sidebar is closed.
   * @param displayedComponentType - Type of component displayed in the closed sidebar.
   */
  public async executeOnCloseActions(displayedComponentType: GlobalSidebarComponent, updatedParameters?: GlobalSidebarDisplayedComponentParameters) {
    this.currentLevel--

    for (const onCloseAction of this.onCloseActions) {
      if (onCloseAction.type === displayedComponentType) {
        await onCloseAction.action(updatedParameters)
      }
    }

    this.onCloseActions = this.onCloseActions.filter(a => a.type !== displayedComponentType)
  }

  /**
   * Indicates whether a global sidebar is opened.
   * @returns true when a global sidebar is opened; otherwise false.
   */
  public isDisplayed() {
    return this.currentLevel > 0
  }

  /**
   * Registers an action to be executed when a global sidebar is closed.
   * @param displayedComponentType - Type of component displayed in the closed sidebar.
   * @param action - Action.
   */
  public registerOnCloseAction(displayedComponentType: GlobalSidebarComponent, action: (updatedParameters?: GlobalSidebarDisplayedComponentParameters) => void | Promise<void>) {
    this.onCloseActions.push({ action, type: displayedComponentType })
  }
}