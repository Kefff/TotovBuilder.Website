import { IChangelogText } from './IChangelogText'

/**
 * provides the functionalities of a changelog.
 */
export interface IChangelog {
  /**
   * Changes.
   */
  changes: IChangelogText[]

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