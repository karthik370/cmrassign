const fontCache = new Map<string, FontFace>()

export const loadCustomFont = async (
  fontUrl: string,
  fontName: string
): Promise<string> => {
  try {
    // Check if font is already loaded
    if (fontCache.has(fontName)) {
      return fontName
    }

    // Create FontFace
    const fontFace = new FontFace(fontName, `url(${fontUrl})`)

    // Load font
    await fontFace.load()

    // Add to document fonts
    document.fonts.add(fontFace)

    // Cache the font
    fontCache.set(fontName, fontFace)

    return fontName
  } catch (error) {
    console.error('Failed to load font:', error)
    throw new Error('Font loading failed')
  }
}

export const unloadFont = (fontName: string): void => {
  const fontFace = fontCache.get(fontName)
  if (fontFace) {
    document.fonts.delete(fontFace)
    fontCache.delete(fontName)
  }
}

export const isFontLoaded = (fontName: string): boolean => {
  return fontCache.has(fontName)
}

export const preloadFont = async (fontUrl: string, fontName: string): Promise<void> => {
  try {
    await loadCustomFont(fontUrl, fontName)
  } catch (error) {
    console.error('Failed to preload font:', error)
  }
}
