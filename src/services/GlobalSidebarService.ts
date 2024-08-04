import { TinyEmitter } from 'tiny-emitter'
import { GlobalSidebarComponentType, GlobalSidebarDisplayedComponentParametersType, IGlobalSidebarOptions } from '../models/utils/IGlobalSidebarOptions'

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
   * Actions to execute when a global sidebar is closed.
   */
  private onCloseActions: { type: GlobalSidebarComponentType, action: (updatedParameters?: GlobalSidebarDisplayedComponentParametersType) => void | Promise<void> }[] = []

  /**
   * Closes a global sidebar.
   * @param displayedComponentType- Type of component displayed in the global sidebar to close.
   */
  public close(displayedComponentType: GlobalSidebarComponentType) {
    this.emitter.emit(GlobalSidebarService.closeGlobalSidebarEvent, displayedComponentType)
  }

  /**
   * Displays a global sidebar.
   * @param options - Options.
   */
  public display(options: IGlobalSidebarOptions) {
    if (options.onCloseAction != null) {
      this.registerOnCloseAction(options.displayedComponentType, options.onCloseAction)
    }

    this.emitter.emit(GlobalSidebarService.openGlobalSidebarEvent, options)
  }

  /**
   * Executes the actions registered to be executed when a sidebar is closed.
   * @param displayedComponentType - Type of component displayed in the closed sidebar.
   */
  public async executeOnCloseActions(displayedComponentType: GlobalSidebarComponentType, updatedParameters?: GlobalSidebarDisplayedComponentParametersType) {
    for (const onCloseAction of this.onCloseActions) {
      if (onCloseAction.type === displayedComponentType) {
        await onCloseAction.action(updatedParameters)
      }
    }

    this.onCloseActions = this.onCloseActions.filter(a => a.type !== displayedComponentType)
  }

  /**
   * Registers an action to be executed when a global sidebar is closed.
   * @param displayedComponentType - Type of component displayed in the closed sidebar.
   * @param action - Action.
   */
  public registerOnCloseAction(displayedComponentType: GlobalSidebarComponentType, action: (updatedParameters?: GlobalSidebarDisplayedComponentParametersType) => void | Promise<void>) {
    this.onCloseActions.push({ action, type: displayedComponentType })
  }
}