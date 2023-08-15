/**
 * Service initialization state.
 */
export enum ServiceInitializationState {
  /**
   * An error occured during the initialization.
   */
  error,

  /**
   * Services are initialized.
   */
  initialized,

  /**
   * Services are initializing.
   */
  initializing
}