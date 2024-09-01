/**
 * Provides the functionalities of options for converting builds to a text.
 */
export interface IBuildsToTextOptions {
  /**
   * Indicates whether only the link of the build should be included.
   */
  linkOnly: boolean,

  /**
   * Indicates whether prices should be included.
   */
  includePrices: boolean,

  /**
   * Language.
   */
  language: string,

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