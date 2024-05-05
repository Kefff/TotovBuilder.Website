import { IBuild } from '../build/IBuild'

/**
 * Provides the functionalities of a migration triggered on a specified condition when connecting to an updated version
 * of the website.
 */
export interface IMigration {
  /**
   * Migrates a build.
   */
  migrateBuild: (build: IBuild) => Promise<boolean>

  /**
   * Migrates elements of the application that are not related to builds.
   */
  migrateBuildUnrelatedData: () => Promise<boolean>

  /**
   * Version of the website for which the migration must be triggered.
   */
  version: string | undefined
}