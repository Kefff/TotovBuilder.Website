import { anyString, anything, instance, mock, when } from 'ts-mockito'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { PresetService } from '../../services/PresetService'
import Services from '../../services/repository/Services'
import Result from '../../utils/Result'
import { PresetMocks } from '../__data__/presetMocks'

export function usePresetServiceMock(customPresetsList?: IInventoryItem[]): void {
  const presetServiceMock = mock<PresetService>()
  when(presetServiceMock.fetchPresets()).thenResolve(Result.ok())
  when(presetServiceMock.getPreset(anyString())).thenCall((id: string) => getPreset(id, customPresetsList))
  when(presetServiceMock.isPreset(anyString())).thenCall((id: string) => getPreset(id) != null)
  when(presetServiceMock.updatePresetProperties(anything())).thenResolve()

  Services.configure(PresetService, undefined, instance(presetServiceMock))
}

function getPreset(id: string, customPresetsList?: IInventoryItem[]): IInventoryItem | undefined {
  const preset = (customPresetsList ?? PresetMocks).find(p => p.itemId === id)

  return preset
}