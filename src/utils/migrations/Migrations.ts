import { IMigration } from '../../models/utils/IMigration'
import { Migration160 } from './Migration1.6.0'
import { Migration171 } from './Migration1.7.1'
import { Migration181 } from './Migration1.8.1'
import { Migration200 } from './Migration2.0.0'
import { MigrationCompassToSpecial } from './MigrationCompassToSpecial'

/**
 * List of all the migrations.
 */
const applicationMigrations: IMigration[] = [
  new MigrationCompassToSpecial(),
  new Migration160(),
  new Migration171(),
  new Migration181(),
  new Migration200()
]

export default applicationMigrations