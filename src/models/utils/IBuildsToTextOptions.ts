/**
 * Provides the functionalities of options for converting builds to a text.
 */
export interface IBuildsToTextOptions {
  /**
   * Game mode.
   */
  gameMode: string

  /**
   * Indicates whether emojis should be included.
   */
  includeEmojis: boolean

  /**
   * Indicates whether the link should be included.
   */
  includeLink: boolean,

  /**
   * Indicates whether prices should be included.
   */
  includePrices: boolean,

  /**
   * Language.
   */
  language: string,

  /**
   * Indicates whether only the link of the build should be included.
   */
  linkOnly: boolean,

  /**
   * Type of expected text.
   */
  type: BuildsToTextType
}

/**
 * Type of text to contruct when converting builds to a text.
 */
export enum BuildsToTextType {
  /**
   * Markdown.
   */
  markdown,

  /**
   * Simple text.
   */
  simpleText
}