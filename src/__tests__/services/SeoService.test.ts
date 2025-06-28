import { describe, expect, it, vi } from 'vitest'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import Services from '../../services/repository/Services'
import { SeoService } from '../../services/SeoService'
import { build1 } from '../__data__/buildMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { usePresetServiceMock } from '../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'

describe('SeoService', () => {
  describe('getBuildSeoDescription', () => {
    it('should get the description of a build formatted for SEO', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()

      const service = new SeoService()
      const buildSummary = await Services.get(BuildPropertiesService).getSummaryAsync(build1)

      // Act
      const result = service.getBuildSeoDescription(buildSummary)

      // Assert
      expect(result).toBe('↕️ Vertical recoil 66   ↔️ Horizontal recoil 216   ✋ Ergonomics 31 (-17.5%)    🛡️ Armor class 4   🏃 Speed -7%   🔄 Turning speed -12%    💵 Price 361,226₽   ⚓ Weight 26.153 kg')
    })
  })

  describe('getBuildSeoMetadata', () => {
    it.each([
      [true],
      [false]
    ])('should get SEO metadata corresponding to a build', async (buildHasName: boolean) => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()

      const sharableUrl = 'http://localhost:3000/s/XQAAAAK6BAAAAAAAAABBKEnKciJ9Ha4afmksn3IsDhJ5O4QenVHR6M9GIERw3HZt4SozAJ4ecag7fexwq5EsA3ZY3G9JALNl2jZAHroUrkr2uphzBhRzPCNtuO6Uc6K_tEMpKRwdhvxFpuse2mVINUQGFI8lUj-5pSeRRqWdF2EaM5qVY_yqoEBbG48VQ0KvuCZcXygCoBPez45CigdHq5kOCmX6JP6TdRwc3_eP85HoZKTFmKeqoueCPFEVVnRZBoEcWYM3fX8BHhr1YCeHQTJm50-vGIyQ1uLNyiIpuq1cFP_3JNTnY-hdAMnba6kb8PEY9aLk8cavZS4xq8lqn96NXF-H1_OWlOwFEWFr2VoBSI0RBwAxRMQgG0g3nX8MJ2BuAWQdz8xd6T39XBk6igferK_Ex-StaEA2Pi93OzxIlXgqPxc1HzpgWhbGiu_L9zMhr7NejxOgBy_rf8iUUmRlxGtuiUMv_6Nv35uG8rX9bl49_jHA2S5txChG3gjXBbVuReiUhsgZ9gT4xOQEQ_g33pDjRPMVC-bLbPHJcBuE2pbQOThseLH4rUjK6Sb9IbF99ZNiWHRQF4cieUYTOgqVu58gCOQB3_lygItavScD6KD6ETn76Ld4PKfNdDBTW60zKOTDUfLOKskPAvv8CJS6JIOZmG7z_bNwXWARPvkJgt24Ywgc1c_CuqrOoDN0iCO6QtaYMI3KcKgbqf16_1WH7L2-6ogCMKK0sAadxDUFJJ7BF3mvgQC_Ty9YilypMSb3oKwOpZIoK9kljWX_3NDn0DpMmjcn4bU3jMtikHjuX0FecBTU1iYhGDp7Trritv94OWkA'

      const service = new SeoService()

      if (!buildHasName) {
        build1.name = ''
      }

      const buildSummary = await Services.get(BuildPropertiesService).getSummaryAsync(build1)

      // Act
      const result = service.getBuildSeoMetadata(buildSummary, sharableUrl)

      // Assert
      expect(result).toStrictEqual({
        description: '↕️ Vertical recoil 66   ↔️ Horizontal recoil 216   ✋ Ergonomics 31 (-17.5%)    🛡️ Armor class 4   🏃 Speed -7%   🔄 Turning speed -12%    💵 Price 361,226₽   ⚓ Weight 26.153 kg',
        image: 'https://assets.tarkov.dev/5c0d1ec986f77439512a1a72-image.webp',
        imageAlt: buildHasName ? 'Build 1' : 'New build',
        title: buildHasName ? 'Build 1' : 'New build',
        url: sharableUrl
      })
    })
  })

  describe('initialize', () => {
    it('should initialize SEO metadata', async () => {
      // Arrange
      vi.mock('@unhead/vue')
      const unheadMock = await import('@unhead/vue')
      const useSeoMetaMock = unheadMock.useSeoMeta = vi.fn()

      const service = new SeoService()

      // Arrange
      service.initialize()

      // Assert
      expect(useSeoMetaMock).toHaveBeenCalled()
    })
  })

  describe('updateSeoMetadata', () => {
    it('should update SEO metadata', () => {
      // Arrange
      const description = 'This is a desciption'
      const image = 'https://www.image.com/image.png'
      const imageAlt = 'This is an image'
      const title = 'This is a title'
      const url = 'https://www.test.com/'

      const service = new SeoService()

      // Act
      service.updateSeoMetadata({
        description,
        image,
        imageAlt,
        title,
        url
      })

      // Assert
      expect(service.description).toBe(description)
      expect(service.image).toBe(image)
      expect(service.imageAlt).toBe(`${imageAlt} - Totov Builder`)
      expect(service.title).toBe(`${title} - Totov Builder`)
      expect(service.url).toBe(url)
    })
  })
})