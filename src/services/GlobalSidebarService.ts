import { TinyEmitter } from 'tiny-emitter'
import { GlobalSidebarDisplayedComponentParametersType, IGlobalSidebarOptions } from '../models/utils/IGlobalSidebarOptions'

/**
 * Represents a service responsible for managing a GlobalSidebarComponent.
 */
export class GlobalSidebarService {
  /**
   * Name of the event fired to ask the global sidebar to close.
   */
  public static closeGlobalSidebarEvent = 'closeGlobalSidebar'

  /**
   * Name of the event fired to ask the global sidebar to open.
   */
  public static openGlobalSidebarEvent = 'openGlobalSidebar'

  /**
   * Event emitter used to open and close the global sidebar.
   */
  public emitter = new TinyEmitter()

  /**
   * Actions to execute when closing the global sidebar.
   */
  private onClosingActions: ((updatedParameters?: GlobalSidebarDisplayedComponentParametersType) => void | Promise<void>)[] = []

  /**
   * Closes the global sidebar.
   */
  public close() {
    this.emitter.emit(GlobalSidebarService.closeGlobalSidebarEvent)
  }

  /**
   * Displays the global sidebar.
   * @param options - Options.
   */
  public display(options: IGlobalSidebarOptions) {
    this.emitter.emit(GlobalSidebarService.openGlobalSidebarEvent, options)
  }

  /**
   * Executes the actions registered to be closed when the sidebare is closing.
   */
  public async executeOnClosingActions(updatedParameters?: GlobalSidebarDisplayedComponentParametersType) {
    for (const onClosingAction of this.onClosingActions) {
      await onClosingAction(updatedParameters)
    }

    this.onClosingActions = []
  }

  /**
   * Registers an action to be executed when the global sidebard is closing.
   * @param action - Action.
   */
  public registerOnClosingAction(action: (updatedParameters?: GlobalSidebarDisplayedComponentParametersType) => void | Promise<void>) {
    this.onClosingActions.push(action)
  }
}