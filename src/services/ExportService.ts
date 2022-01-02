import { IBuild } from '../models/build/IBuild'
import FileSaver from 'file-saver'
import vueI18n from '../plugins/vueI18n'
import Result, { FailureType } from '../utils/Result'
import Services from './repository/Services'
import { BuildService } from './BuildService'
import Configuration from '../../test-data/configuration.json'

/**
 * Represents a service responsible for exporting builds.
 */
export class ExportService {
  /**
   * Exports a list of builds.
   * @param builds - Builds.
   */
  /* istanbul ignore next */
  public export(builds: IBuild[]): Result {
    if (builds.length === 0) {
      return Result.fail(FailureType.error, 'ExportService.export()', vueI18n.t('message.noBuildsToExport'))
    }

    const json = JSON.stringify(builds)
    const blob = new Blob([json], { type: 'text/json;charset=utf-8' })
    const exportedBuildsName = builds.length === 1 ? builds[0].name : builds.length + ' ' + vueI18n.t('caption.builds')
    const fileName =
      Configuration.VITE_EXPORT_FILE_NAME_PREFIX as string
      + ' - ' + exportedBuildsName + ' - '
      + new Date().toLocaleString()
      + Configuration.VITE_EXPORT_FILE_EXTENSION as string
    FileSaver.saveAs(blob, fileName)

    const buildService = Services.get(BuildService)

    for (const build of builds) {
      build.lastExported = new Date()
      const updateResult = buildService.update(build.id, build)

      if (!updateResult.success) {
        return updateResult
      }
    }

    return Result.ok()
  }
}