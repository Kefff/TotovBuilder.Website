import { IBuild } from '../build/IBuild'
import { IBuildSummary } from './IBuildSummary'

/**
 * Provides the functionalities of the result of a builds import.
 */
export interface IBuildsImportResult {
  /**
   * Imported builds.
   */
  builds: IBuild[]

  /**
   * Importer builds summaries.
   */
  buildSummaries: IBuildSummary[]
}