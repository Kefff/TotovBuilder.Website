import { spy, verify } from 'ts-mockito'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { ShareButtons } from '../../../models/utils/ShareButtons'
import WebBrowserUtils from '../../../utils/WebBrowserUtils'

describe('ShareButtons', () => {
  describe('bluesky', () => {
    describe('onClick', () => {
      it.each([
        [true],
        [false]
      ])('should share on Bluesky (isMobile: %s)', (isMobile: boolean) => {
        // Arrange
        let openedUrl = ''

        const openSpy = vi.spyOn(window, 'open')
        openSpy.mockImplementationOnce((u): Window | null => {
          openedUrl = u as string
          return null
        })

        const isTouchScreenSpy = vi.spyOn(WebBrowserUtils, 'isTouchScreen')
        isTouchScreenSpy.mockImplementationOnce(() => ref(isMobile))

        // Act
        ShareButtons.bluesky.onClick('https://www.totovbuilder.com/s/a%&=ù*_z', 'Totov Builder', 'This is the text')

        // Assert
        expect(openedUrl).toBe(
          isMobile
            ? 'bluesky://intent/compose?text=Totov%20Builder%0AThis%20is%20the%20text%0Ahttps://www.totovbuilder.com/s/a%25&=%C3%B9*_z'
            : 'https://bsky.app/intent/compose?text=Totov%20Builder%0AThis%20is%20the%20text%0Ahttps://www.totovbuilder.com/s/a%25&=%C3%B9*_z')

      })
    })
  })

  describe('discord', () => {
    describe('onClick', () => {
      it('should execute the onClick action', () => {
        // Arrange

        const discordSpy = spy(ShareButtons.discord)

        // Act
        ShareButtons.discord.onClick('https://www.totovbuilder.com/s/a%&=ù*_z', 'Totov Builder', 'This is the text')

        // Assert
        verify(discordSpy.onClick('https://www.totovbuilder.com/s/a%&=ù*_z', 'Totov Builder', 'This is the text')).once()
      })
    })
  })

  describe('facebook', () => {
    describe('onClick', () => {
      it('should share on Facebook', () => {
        // Arrange
        let openedUrl = ''

        const openSpy = vi.spyOn(window, 'open')
        openSpy.mockImplementationOnce((url): Window | null => {
          openedUrl = url as string
          return null
        })

        // Act
        ShareButtons.facebook.onClick('https://www.totovbuilder.com/s/a%&=ù*_z', 'Totov Builder', 'This is the text')

        // Assert
        expect(openedUrl).toBe('https://www.facebook.com/sharer.php?u=https://www.totovbuilder.com/s/a%25&=%C3%B9*_z')
      })
    })
  })

  describe('link', () => {
    describe('onClick', () => {
      it('should copy the link to clipboard', () => {
        // Arrange
        const webBrowserUtilsSpy = spy(WebBrowserUtils)

        // Act
        ShareButtons.link.onClick('https://www.totovbuilder.com/s/a%&=ù*_z', 'Totov Builder', 'This is the text')

        // Assert
        verify(webBrowserUtilsSpy.copyToClipboardAsync('https://www.totovbuilder.com/s/a%&=ù*_z')).once()
      })
    })
  })

  describe('mail', () => {
    describe('onClick', () => {
      it('should share by mail', () => {
        // Arrange
        let openedUrl = ''

        const openSpy = vi.spyOn(window, 'open')
        openSpy.mockImplementationOnce((url): Window | null => {
          openedUrl = url as string
          return null
        })

        // Act
        ShareButtons.mail.onClick('https://www.totovbuilder.com/s/a%&=ù*_z', 'Totov Builder', 'This is the text')

        // Assert
        expect(openedUrl).toBe('mailto:?subject=Totov%20Builder&body=Totov%20Builder%0AThis%20is%20the%20text%0Ahttps://www.totovbuilder.com/s/a%25&=%C3%B9*_z')
      })
    })
  })

  describe('messenger', () => {
    describe('onClick', () => {
      it('should share on Messenger', () => {
        // Arrange
        let openedUrl = ''

        const openSpy = vi.spyOn(window, 'open')
        openSpy.mockImplementationOnce((url): Window | null => {
          openedUrl = url as string
          return null
        })

        // Act
        ShareButtons.messenger.onClick('https://www.totovbuilder.com/s/a%&=ù*_z', 'Totov Builder', 'This is the text')

        // Assert
        expect(openedUrl).toBe('fb-messenger://share?link=https://www.totovbuilder.com/s/a%25&=%C3%B9*_z')
      })
    })
  })

  describe('reddit', () => {
    describe('onClick', () => {
      it('should share on Reddit', () => {
        // Arrange
        let openedUrl = ''

        const openSpy = vi.spyOn(window, 'open')
        openSpy.mockImplementationOnce((url): Window | null => {
          openedUrl = url as string
          return null
        })

        // Act
        ShareButtons.reddit.onClick('https://www.totovbuilder.com/s/a%&=ù*_z', 'Totov Builder', 'This is the text')

        // Assert
        expect(openedUrl).toBe('https://www.reddit.com/submit?url=https://www.totovbuilder.com/s/a%25&=%C3%B9*_z&title=Totov%20Builder%0AThis%20is%20the%20text')
      })
    })
  })

  describe('sms', () => {
    describe('onClick', () => {
      it('should share by SMS', () => {
        // Arrange
        let openedUrl = ''

        const openSpy = vi.spyOn(window, 'open')
        openSpy.mockImplementationOnce((url): Window | null => {
          openedUrl = url as string
          return null
        })

        // Act
        ShareButtons.sms.onClick('https://www.totovbuilder.com/s/a%&=ù*_z', 'Totov Builder', 'This is the text')

        // Assert
        expect(openedUrl).toBe('sms:?body=Totov%20Builder%0AThis%20is%20the%20text%0Ahttps://www.totovbuilder.com/s/a%25&=%C3%B9*_z')
      })
    })
  })

  describe('telegram', () => {
    describe('onClick', () => {
      it('should share on Telegram', () => {
        // Arrange
        let openedUrl = ''

        const openSpy = vi.spyOn(window, 'open')
        openSpy.mockImplementationOnce((url): Window | null => {
          openedUrl = url as string
          return null
        })

        // Act
        ShareButtons.telegram.onClick('https://www.totovbuilder.com/s/a%&=ù*_z', 'Totov Builder', 'This is the text')

        // Assert
        expect(openedUrl).toBe('https://t.me/share/url?url=https://www.totovbuilder.com/s/a%25&=%C3%B9*_z&text=Totov%20Builder%E2%80%81%E2%80%81%E2%80%81This%20is%20the%20text')
      })
    })
  })

  describe('twitter', () => {
    describe('onClick', () => {
      it('should share on Twitter', () => {
        // Arrange
        let openedUrl = ''

        const openSpy = vi.spyOn(window, 'open')
        openSpy.mockImplementationOnce((url): Window | null => {
          openedUrl = url as string
          return null
        })

        // Act
        ShareButtons.twitter.onClick('https://www.totovbuilder.com/s/a%&=ù*_z', 'Totov Builder', 'This is the text')

        // Assert
        expect(openedUrl).toBe('https://twitter.com/intent/tweet?url=https://www.totovbuilder.com/s/a%25&=%C3%B9*_z&text=Totov%20Builder%0AThis%20is%20the%20text')
      })
    })
  })

  describe('whatsapp', () => {
    describe('onClick', () => {
      it('should share on Whatsapp', () => {
        // Arrange
        let openedUrl = ''

        const openSpy = vi.spyOn(window, 'open')
        openSpy.mockImplementationOnce((url): Window | null => {
          openedUrl = url as string
          return null
        })

        // Act
        ShareButtons.whatsapp.onClick('https://www.totovbuilder.com/s/a%&=ù*_z', 'Totov Builder', 'This is the text')

        // Assert
        expect(openedUrl).toBe('whatsapp://send?text=Totov%20Builder%0AThis%20is%20the%20text%0Ahttps://www.totovbuilder.com/s/a%25&=%C3%B9*_z')
      })
    })
  })
})