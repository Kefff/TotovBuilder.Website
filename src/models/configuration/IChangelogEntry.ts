import { IChangelogChange } from './IChangelogChange'

/**
 * Provides the functionalities of a changelog entry.
 */
export interface IChangelogEntry {
  /**
   * Changes.
   */
  changes: IChangelogChange[]

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