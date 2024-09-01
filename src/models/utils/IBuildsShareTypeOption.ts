
/**
 * Provides the functionalities of builds share type options.
 */
export interface IBuildsShareTypeOption {
  /**
   * Caption.
   */
  caption: string,

  /**
   * Icon.
   */
  icon: string | string[],

  /**
   * CSS class to apply to the icon.
   */
  iconCssClass?: string

  /**
   * Type.
   */
  type: 'discordMarkdown' | 'redditMarkdown' | 'simpleText'
}