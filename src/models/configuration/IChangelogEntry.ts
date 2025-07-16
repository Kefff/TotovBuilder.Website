/**
 * Provides the functionalities of a changelog entry.
 */
export interface IChangelogEntry {
  /**
   * Changes.
   */
  changes: Record<string, string>[]

  /**
   * Date.
   */
  date: Date

  /**
   * Indicates whether the changelog has appeared since the last visit.
   */
  isNew: boolean

  /**
   * Version.
   */
  version: string
}