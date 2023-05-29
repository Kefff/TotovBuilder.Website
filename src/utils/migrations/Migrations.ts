import { IMigration } from '../../models/utils/IMigration'
import { Migration160 } from './Migration1.6.0'
import { MigrationCompassToSpecial } from './MigrationCompassToSpecial'

/**
 * List of all the migrations.
 */
const applicationMigrations: IMigration[] = [
  new MigrationCompassToSpecial(),
  new Migration160()
]

export default applicationMigrations