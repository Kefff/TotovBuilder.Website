import { anyString, anything, instance, mock, when } from 'ts-mockito'
import { PresetService } from '../services/PresetService'
import Services from '../services/repository/Services'
import { IInventoryItem } from '../models/build/IInventoryItem'
import PresetsMock from '../../test-data/presets.json'

export function usePresetServiceMock(customPresetsList?: IInventoryItem[]): void {
  const presetServiceMock = mock<PresetService>()
  when(presetServiceMock.fetchPresets()).thenReturn(Promise.resolve())
  when(presetServiceMock.getPreset(anyString())).thenCall((id: string) => getPreset(id, customPresetsList))
  when(presetServiceMock.isPreset(anyString())).thenCall((id: string) => getPreset(id) != null)
  when(presetServiceMock.updatePresetProperties(anything())).thenReturn(Promise.resolve())

  Services.configure(PresetService, undefined, instance(presetServiceMock))
}

function getPreset(id: string, customPresetsList?: IInventoryItem[]): IInventoryItem | undefined {
  const preset = (customPresetsList ?? PresetsMock).find(p => p.itemId === id)

  return preset
}