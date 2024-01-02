import { IMigration } from '../../models/utils/IMigration'
import { Migration160 } from './Migration1.6.0'
import { Migration171 } from './Migration1.7.1'
import { MigrationCompassToSpecial } from './MigrationCompassToSpecial'

/**
 * List of all the migrations.
 */
const applicationMigrations: IMigration[] = [
  new MigrationCompassToSpecial(),
  new Migration160(),
  new Migration171()
]

export default applicationMigrations