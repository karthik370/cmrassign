'use client'

import { useState, useEffect } from 'react'
import { Save, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TextToHandwriting } from './TextToHandwriting'
import { PageNavigator } from './PageNavigator'
import { PageThumbnails } from './PageThumbnails'
import { ColorPicker, type InkColor } from './ColorPicker'
import { FontSizeControl } from './FontSizeControl'
import { FontWeightControl } from './FontWeightControl'
import { LetterSpacingControl } from './LetterSpacingControl'
import { DimensionControls } from './DimensionControls'
import { FontChanger } from './FontChanger'
import { DrawingCanvas } from './DrawingCanvas'
import { TextBlock, PageEdit, Project, PageDimensions } from '@/types/project'
import { Font } from '@/types/font'
import { loadCustomFont } from '@/lib/font-loader'
import { generateId } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import axios from 'axios'

const DEFAULT_DIMENSIONS: PageDimensions = {
  lineBoxHeight: 30.5,
  lineSpacing: 24.6,
  marginLeft: 40,
  marginRight: -220,
  marginTop: 93,
}

interface PDFEditorProps {
  project: Project
  font: Font
  pageEdits: PageEdit[]
}

export const PDFEditor = ({ project, font, pageEdits: initialPageEdits }: PDFEditorProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageEdits, setPageEdits] = useState<Record<number, PageEdit>>(
    initialPageEdits.reduce((acc, edit) => ({ ...acc, [edit.page_number]: edit }), {})
  )
  const [pageDrawings, setPageDrawings] = useState<Record<number, any[]>>(
    initialPageEdits.reduce((acc, edit) => ({ 
      ...acc, 
      [edit.page_number]: edit.drawing_data || [] 
    }), {})
  )
  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false)
  const [inkColor, setInkColor] = useState<InkColor>('black')
  const [fontSize, setFontSize] = useState(24) // Default font size (10-40pt range)
  const [fontWeight, setFontWeight] = useState(400) // Default font weight (300-700)
  const [letterSpacing, setLetterSpacing] = useState(0) // Default letter spacing (px)
  const [currentFont, setCurrentFont] = useState<Font>(font)
  const [fontLoaded, setFontLoaded] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [actualPageCount, setActualPageCount] = useState(project.page_count)
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null)
  const [overflowData, setOverflowData] = useState<{ page: number; overflowLines: string[]; totalLines: number } | null>(null)
  const [showLeftSidebar, setShowLeftSidebar] = useState(true)
  const [showRightSidebar, setShowRightSidebar] = useState(true)
  const [visitedPages, setVisitedPages] = useState<Set<number>>(new Set([1])) // Track which pages user has visited (start with page 1)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      const wasMobile = isMobile
      setIsMobile(mobile)
      
      // On first load, hide sidebars if mobile
      if (mobile && !wasMobile && showLeftSidebar && showRightSidebar) {
        setShowLeftSidebar(false)
        setShowRightSidebar(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mark current page as visited when user navigates to it
  useEffect(() => {
    setVisitedPages(prev => {
      const newSet = new Set(prev)
      newSet.add(currentPage)
      if (!prev.has(currentPage)) {
        console.log(`👁️ Page ${currentPage} marked as VISITED - auto-overflow will stop for this page`)
      }
      return newSet
    })
  }, [currentPage])

  // REMOVED: Don't load page-specific settings
  // Settings from page 1 now apply globally to all pages
  // This ensures consistent formatting across the entire document

  // Handle client-detected page count
  const handlePageCountDetected = (detectedCount: number) => {
    console.log(`🔍 Client detected ${detectedCount} pages, server said ${project.page_count}`)
    if (detectedCount !== project.page_count) {
      console.log(`⚠️  Page count mismatch! Updating to ${detectedCount} pages`)
      setActualPageCount(detectedCount)
      
      // Initialize page edits for missing pages ONLY (don't overwrite existing)
      setPageEdits(prev => {
        const newPageEdits = { ...prev }
        let hasChanges = false
        
        for (let i = 1; i <= detectedCount; i++) {
          if (!newPageEdits[i]) {
            newPageEdits[i] = {
              id: generateId(),
              project_id: project.id,
              page_number: i,
              text_content: [{ id: 'main', text: '', x: 0, y: 0, width: 0, height: 0, fontSize, fontWeight, letterSpacing, color: inkColor }],
              detected_areas: null,
              ink_color: inkColor,
              line_colors: {},
              dimensions: DEFAULT_DIMENSIONS,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
            hasChanges = true
          }
        }
        
        return hasChanges ? newPageEdits : prev
      })
    }
  }

  // Debug log for page count
  useEffect(() => {
    console.log('📊 Project page count from server:', project.page_count)
    console.log('📊 Actual page count:', actualPageCount)
    console.log('📊 Total page edits loaded:', Object.keys(pageEdits).length)
  }, [project, pageEdits, actualPageCount])

  // Load custom font
  useEffect(() => {
    setFontLoaded(false)
    loadCustomFont(currentFont.font_file_url, `project-${currentFont.id}`)
      .then(() => setFontLoaded(true))
      .catch((err) => {
        console.error('Failed to load font:', err)
      })
  }, [currentFont])

  // Initialize page edits for all pages ONLY ONCE when actualPageCount is first set
  useEffect(() => {
    if (!actualPageCount) return
    
    setPageEdits(prev => {
      const newPageEdits = { ...prev }
      let hasChanges = false
      
      for (let i = 1; i <= actualPageCount; i++) {
        if (!newPageEdits[i]) {
          // Initialize empty text content for each page with current global settings
          newPageEdits[i] = {
            id: generateId(),
            project_id: project.id,
            page_number: i,
            text_content: [{ id: 'main', text: '', x: 0, y: 0, width: 0, height: 0, fontSize, fontWeight, letterSpacing, color: inkColor }],
            detected_areas: null,
            ink_color: inkColor,
            line_colors: {},
            dimensions: DEFAULT_DIMENSIONS,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          hasChanges = true
        }
      }
      
      // Only update state if there were changes
      return hasChanges ? newPageEdits : prev
    })
  }, [actualPageCount, project.id])

  // Auto-save current page
  const savePageData = async (data: PageEdit) => {
    try {
      // Get session token for auth
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Not authenticated')
      }

      await axios.post(
        `/api/pdf/${project.id}/page/${data.page_number}/save`,
        {
          text_content: data.text_content,
          ink_color: data.ink_color,
          line_colors: data.line_colors || {},
          dimensions: data.dimensions || DEFAULT_DIMENSIONS,
          drawing_data: data.drawing_data || [],
        },
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      )
    } catch (error) {
      console.error('Failed to save page:', error)
      throw error
    }
  }

  const currentPageEdit = pageEdits[currentPage]
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Handle overflow - sync next page with overflow text UNTIL user visits the next page
  // BEHAVIOR:
  // - Text overflow from Page 1 auto-updates Page 2 continuously
  // - This continues as long as user stays on Page 1
  // - Once user clicks "Next" and visits Page 2, auto-overflow STOPS
  // - If user goes back to Page 1 and edits, Page 2 is NOT updated anymore
  // - This prevents overwriting user's manual edits on the next page
  useEffect(() => {
    if (!actualPageCount) return
    
    const nextPage = currentPage + 1
    if (nextPage > actualPageCount) return // No next page available
    
    const nextPageEdit = pageEdits[nextPage]
    
    // CHECK: Has the user visited the next page? If yes, DON'T auto-sync anymore
    if (visitedPages.has(nextPage)) {
      console.log(`🚫 Page ${nextPage} was already visited - skipping auto-overflow`)
      return
    }
    
    // If there's overflow data for current page, update next page
    if (overflowData && overflowData.page === currentPage && overflowData.overflowLines.length > 0) {
      const overflowText = overflowData.overflowLines.join('\n')
      const currentNextPageText = nextPageEdit?.text_content?.[0]?.text || ''
      
      // Update next page if overflow text is different
      if (currentNextPageText !== overflowText) {
        console.log(`📝 AUTO-OVERFLOW: Updating page ${nextPage} with ${overflowData.overflowLines.length} overflow lines (will stop when user visits page ${nextPage})`)
        
        setPageEdits(prev => ({
          ...prev,
          [nextPage]: {
            ...prev[nextPage],
            id: nextPageEdit?.id || generateId(),
            project_id: project.id,
            page_number: nextPage,
            text_content: [{ id: 'main', text: overflowText, x: 0, y: 0, width: 0, height: 0, fontSize, color: inkColor }],
            ink_color: inkColor,
            line_colors: {},
            dimensions: nextPageEdit?.dimensions || DEFAULT_DIMENSIONS,
            updated_at: new Date().toISOString(),
          }
        }))
      }
    }
  }, [overflowData, currentPage, actualPageCount, fontSize, inkColor, pageEdits, visitedPages])
  
  // Clear overflow data when navigating away from overflow pages or when overflow is resolved
  useEffect(() => {
    if (!overflowData) return
    
    // Clear if we're not on the overflow source page or the page receiving overflow
    const isOnRelevantPage = currentPage === overflowData.page || currentPage === overflowData.page + 1
    if (!isOnRelevantPage) {
      setOverflowData(null)
    }
    
    // Clear if user navigated to the next page (overflow is now "locked")
    if (currentPage === overflowData.page + 1) {
      // User has visited the next page, so overflow is locked - clear tracking
      console.log('📝 User visited next page, overflow is now locked')
      setOverflowData(null)
    }
  }, [currentPage, pageEdits, overflowData])

  // Auto-save effect
  useEffect(() => {
    if (!currentPageEdit) return

    const timeoutId = setTimeout(async () => {
      setIsSaving(true)
      setSaveError(null)
      try {
        await savePageData(currentPageEdit)
        setLastSaved(new Date())
      } catch (error) {
        setSaveError('Save failed')
      } finally {
        setIsSaving(false)
      }
    }, 2000) // Save 2 seconds after last change

    return () => clearTimeout(timeoutId)
  }, [currentPageEdit])


  const handleColorChange = (color: InkColor) => {
    setInkColor(color)
    // Apply color to ALL pages globally
    const updatedPageEdits = { ...pageEdits }
    
    Object.keys(updatedPageEdits).forEach((pageNum) => {
      const page = updatedPageEdits[Number(pageNum)]
      updatedPageEdits[Number(pageNum)] = {
        ...page,
        text_content: page.text_content?.map((block) => ({ ...block, color })) || [],
        ink_color: color,
        updated_at: new Date().toISOString(),
      }
    })

    setPageEdits(updatedPageEdits)
    console.log('🎨 Ink color applied to ALL pages:', color)
  }

  const handleFontSizeChange = (size: number) => {
    setFontSize(size)
    // Apply font size to ALL pages globally
    const updatedPageEdits = { ...pageEdits }
    
    Object.keys(updatedPageEdits).forEach((pageNum) => {
      const page = updatedPageEdits[Number(pageNum)]
      updatedPageEdits[Number(pageNum)] = {
        ...page,
        text_content: page.text_content?.map((block) => ({ ...block, fontSize: size })) || [],
        updated_at: new Date().toISOString(),
      }
    })

    setPageEdits(updatedPageEdits)
    console.log('📏 Font size applied to ALL pages:', size)
  }

  const handleFontWeightChange = (weight: number) => {
    setFontWeight(weight)
    // Apply font weight to ALL pages globally
    const updatedPageEdits = { ...pageEdits }
    
    Object.keys(updatedPageEdits).forEach((pageNum) => {
      const page = updatedPageEdits[Number(pageNum)]
      updatedPageEdits[Number(pageNum)] = {
        ...page,
        text_content: page.text_content?.map((block) => ({ ...block, fontWeight: weight })) || [],
        updated_at: new Date().toISOString(),
      }
    })

    setPageEdits(updatedPageEdits)
    console.log('💪 Font weight applied to ALL pages:', weight)
  }

  const handleLetterSpacingChange = (spacing: number) => {
    setLetterSpacing(spacing)
    // Apply letter spacing to ALL pages globally
    const updatedPageEdits = { ...pageEdits }
    
    Object.keys(updatedPageEdits).forEach((pageNum) => {
      const page = updatedPageEdits[Number(pageNum)]
      updatedPageEdits[Number(pageNum)] = {
        ...page,
        text_content: page.text_content?.map((block) => ({ ...block, letterSpacing: spacing })) || [],
        updated_at: new Date().toISOString(),
      }
    })

    setPageEdits(updatedPageEdits)
    console.log('🔤 Letter spacing applied to ALL pages:', spacing)
  }

  const handleFontChange = async (fontName: string, fontUrl: string) => {
    try {
      // Create a temporary font object to load the new font
      const newFont: Font = {
        ...currentFont,
        name: fontName,
        font_file_url: fontUrl,
        id: `local-${fontName}`, // Temporary ID for local fonts
      }
      
      // Load the new font
      setFontLoaded(false)
      await loadCustomFont(fontUrl, `project-${newFont.id}`)
      
      // Update current font
      setCurrentFont(newFont)
      setFontLoaded(true)
      
      console.log(`✅ Font changed to: ${fontName}`)
    } catch (error) {
      console.error('Failed to change font:', error)
      throw error
    }
  }

  const handleDimensionsChange = (dimensions: PageDimensions) => {
    // Apply dimensions to ALL pages globally
    const updatedPageEdits = { ...pageEdits }
    
    Object.keys(updatedPageEdits).forEach((pageNum) => {
      updatedPageEdits[Number(pageNum)] = {
        ...updatedPageEdits[Number(pageNum)],
        dimensions,
        updated_at: new Date().toISOString(),
      }
    })

    setPageEdits(updatedPageEdits)
    console.log('📐 Dimensions applied to ALL pages:', dimensions)
  }

  const handleDrawingChange = (drawing: any[]) => {
    const currentEdit = pageEdits[currentPage]
    if (!currentEdit) return

    setPageDrawings({
      ...pageDrawings,
      [currentPage]: drawing,
    })

    setPageEdits({
      ...pageEdits,
      [currentPage]: {
        ...currentEdit,
        drawing_data: drawing,
        updated_at: new Date().toISOString(),
      },
    })
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      // Get session token for auth
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        alert('Not authenticated. Please login again.')
        setIsGenerating(false)
        return
      }

      console.log('🔄 Generating PDF...')
      const response = await axios.post(
        `/api/pdf/${project.id}/generate`,
        {
          fontUrl: currentFont.font_file_url, // Send current font URL
        },
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      )
      
      console.log('✅ PDF generation response:', response.data)
      
      if (response.data.success && response.data.downloadUrl) {
        console.log('📥 Download URL received:', response.data.downloadUrl)
        
        try {
          // Fetch the PDF file as a blob
          console.log('🔄 Fetching PDF file...')
          const pdfResponse = await fetch(response.data.downloadUrl)
          
          if (!pdfResponse.ok) {
            throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`)
          }
          
          const blob = await pdfResponse.blob()
          console.log('✅ PDF blob received:', blob.size, 'bytes')
          
          // Create blob URL
          const blobUrl = URL.createObjectURL(blob)
          
          // Create download link
          const link = document.createElement('a')
          link.href = blobUrl
          link.download = `${project.name}_handwritten.pdf`
          link.style.display = 'none'
          
          // Trigger download
          document.body.appendChild(link)
          link.click()
          
          // Cleanup
          setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(blobUrl)
          }, 100)
          
          console.log('✅ PDF download initiated successfully')
          setGeneratedPdfUrl(response.data.downloadUrl)
          alert('✅ PDF downloaded successfully!\n\nCheck your Downloads folder for:\n' + `${project.name}_handwritten.pdf`)
          
        } catch (fetchError) {
          console.error('❌ Failed to download PDF:', fetchError)
          // Store URL for manual download
          setGeneratedPdfUrl(response.data.downloadUrl)
          // Fallback: open in new tab
          console.log('🔄 Trying fallback: opening in new tab...')
          window.open(response.data.downloadUrl, '_blank')
          alert('⚠️ Direct download failed.\n\nPDF opened in new tab.\nUse browser\'s Save/Download option.\n\nOr use the "Download PDF" button that appeared.')
        }
      } else {
        console.error('❌ Invalid response:', response.data)
        alert('⚠️ PDF generated but no download URL received.\nCheck console for details.')
      }
    } catch (error: any) {
      console.error('❌ Failed to generate PDF:', error)
      alert(`Failed to generate PDF: ${error.response?.data?.error || error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const filledPages = Object.keys(pageEdits)
    .map(Number)
    .filter((pageNum) => {
      const edit = pageEdits[pageNum]
      return edit?.text_content?.some((block) => block.text.length > 0)
    })

  if (!fontLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-primary-600" size={48} />
        <span className="ml-3 text-lg">Loading font...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - Responsive */}
      <div className="bg-white border-b p-3 md:p-4 shadow-sm flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">{project.name}</h1>
            <p className="text-xs md:text-sm text-gray-600">
              {isSaving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Not saved yet'}
              {saveError && <span className="text-red-600 ml-2">{saveError}</span>}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {generatedPdfUrl && (
              <a
                href={generatedPdfUrl}
                download={`${project.name}.pdf`}
                className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md hover:shadow-lg text-sm md:text-base text-center"
              >
                <Download size={16} className="inline mr-1 md:mr-2" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden">PDF</span>
              </a>
            )}
            
            <Button
              variant="primary"
              onClick={handleGeneratePDF}
              isLoading={isGenerating}
              disabled={isGenerating}
              className="flex-1 md:flex-none text-sm md:text-base"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin mr-1 md:mr-2" size={16} />
                  <span className="hidden sm:inline">Generating...</span>
                  <span className="sm:hidden">Gen...</span>
                </>
              ) : (
                <>
                  <Download size={16} className="mr-1 md:mr-2" />
                  <span className="hidden sm:inline">{generatedPdfUrl ? 'Regenerate' : 'Generate'}</span>
                  <span className="sm:hidden">Gen</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Page Thumbnails (Mobile Overlay / Desktop Fixed) */}
        {showLeftSidebar && (
          <>
            {/* Mobile backdrop */}
            {isMobile && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={() => setShowLeftSidebar(false)}
              />
            )}
            {/* Sidebar */}
            <div className={`
              ${isMobile ? 'fixed left-0 top-0 bottom-0 z-50' : 'relative border-r'}
              w-64 md:w-48 bg-white flex-shrink-0 shadow-2xl md:shadow-none
            `}>
              <div className="h-full flex flex-col">
                {/* Mobile header */}
                {isMobile && (
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-semibold text-gray-900">Pages</h2>
                    <button
                      onClick={() => setShowLeftSidebar(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <PageThumbnails
                    totalPages={actualPageCount || 1}
                    currentPage={currentPage}
                    filledPages={filledPages}
                    onPageSelect={(page) => {
                      setCurrentPage(page)
                      if (isMobile) setShowLeftSidebar(false)
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Center - Text to Handwriting Canvas */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Overflow Warning - Current Page Has Overflow - REAL-TIME */}
          {overflowData && currentPage === overflowData.page && overflowData.overflowLines.length > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-300 px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex flex-col">
                    <span className="text-orange-800 font-semibold text-sm">
                      Real-Time Overflow Active
                    </span>
                    <span className="text-orange-600 text-xs">
                      {overflowData.overflowLines.length} lines → Page {currentPage + 1} (auto-updating)
                    </span>
                  </div>
                </div>
                {currentPage < actualPageCount! && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all shadow-sm hover:shadow text-xs font-semibold"
                  >
                    View Next Page →
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Overflow Auto-Fill Badge - Next Page Received Overflow - REAL-TIME */}
          {overflowData && currentPage === overflowData.page + 1 && pageEdits[currentPage]?.text_content?.[0]?.text && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-300 px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <div className="flex flex-col">
                    <span className="text-blue-800 font-semibold text-sm">
                      Real-Time Auto-Filled
                    </span>
                    <span className="text-blue-600 text-xs">
                      {overflowData.overflowLines.length} overflow lines from Page {overflowData.page}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentPage(overflowData.page)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow text-xs font-semibold"
                >
                  ← Back to Page {overflowData.page}
                </button>
              </div>
            </div>
          )}
          
          <TextToHandwriting
            key={currentPage}
            pdfUrl={project.original_pdf_url}
            pageNumber={currentPage}
            fontFamily={`project-${currentFont.id}`}
            fontSize={fontSize}
            fontWeight={fontWeight}
            letterSpacing={letterSpacing}
            inkColor={inkColor}
            dimensions={currentPageEdit?.dimensions || DEFAULT_DIMENSIONS}
            initialText={currentPageEdit?.text_content?.[0]?.text || ''}
            initialLineColors={currentPageEdit?.line_colors || {}}
            drawingMode={showDrawingCanvas}
            drawingData={pageDrawings[currentPage] || []}
            onDrawingChange={handleDrawingChange}
            onPageCountDetected={handlePageCountDetected}
            onOverflowDetected={(overflowLines, totalLines) => {
              setOverflowData({ page: currentPage, overflowLines, totalLines })
            }}
            showOverflowFrom={undefined}
            onTextChange={(text) => {
              if (currentPageEdit) {
                const updatedEdit: PageEdit = {
                  ...currentPageEdit,
                  text_content: [{ id: 'main', text, x: 0, y: 0, width: 0, height: 0, fontSize, fontWeight, letterSpacing, color: inkColor }],
                  updated_at: new Date().toISOString(),
                }
                setPageEdits({
                  ...pageEdits,
                  [currentPage]: updatedEdit,
                })
              }
            }}
            onLineColorsChange={(lineColors) => {
              if (currentPageEdit) {
                const updatedEdit: PageEdit = {
                  ...currentPageEdit,
                  line_colors: lineColors as Record<number, string>,
                  updated_at: new Date().toISOString(),
                }
                setPageEdits({
                  ...pageEdits,
                  [currentPage]: updatedEdit,
                })
              }
            }}
          />
          
          {/* Mobile Toggle Buttons - Floating Bottom */}
          <div className="fixed bottom-20 left-0 right-0 z-30 flex justify-center gap-3 px-4 md:hidden pointer-events-none">
            <button
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="pointer-events-auto bg-black text-green-400 border-2 border-green-500 rounded-full px-4 py-3 shadow-2xl hover:bg-gray-900 transition-all font-mono text-sm font-bold"
            >
              📄 Pages
            </button>
            <button
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="pointer-events-auto bg-black text-green-400 border-2 border-green-500 rounded-full px-4 py-3 shadow-2xl hover:bg-gray-900 transition-all font-mono text-sm font-bold"
            >
              🛠️ Tools
            </button>
          </div>
          
          {/* Desktop Toggle Buttons - Floating Top */}
          <button
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            className="hidden md:block absolute top-4 left-4 z-10 bg-white border-2 border-gray-300 rounded-lg p-2 shadow-lg hover:bg-gray-50 transition-colors"
            title={showLeftSidebar ? "Hide pages" : "Show pages"}
          >
            {showLeftSidebar ? (
              <span className="text-sm">◀ Pages</span>
            ) : (
              <span className="text-sm">▶ Pages</span>
            )}
          </button>
          
          <button
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            className="hidden md:block absolute top-4 right-4 z-10 bg-white border-2 border-gray-300 rounded-lg p-2 shadow-lg hover:bg-gray-50 transition-colors"
            title={showRightSidebar ? "Hide tools" : "Show tools"}
          >
            {showRightSidebar ? (
              <span className="text-sm">Tools ▶</span>
            ) : (
              <span className="text-sm">◀ Tools</span>
            )}
          </button>
        </div>

        {/* Right Sidebar - Tools (Mobile Overlay / Desktop Fixed) */}
        {showRightSidebar && (
          <>
            {/* Mobile backdrop */}
            {isMobile && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={() => setShowRightSidebar(false)}
              />
            )}
            {/* Sidebar */}
            <div className={`
              ${isMobile ? 'fixed right-0 top-0 bottom-0 z-50' : 'relative border-l'}
              w-full md:w-72 bg-white flex-shrink-0 shadow-2xl md:shadow-none
            `}>
              <div className="h-full flex flex-col">
                {/* Mobile header */}
                {isMobile && (
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-semibold text-gray-900">Tools</h2>
                    <button
                      onClick={() => setShowRightSidebar(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {!isMobile && (
                    <h2 className="text-base font-semibold text-gray-900 mb-3">
                      Tools
                    </h2>
                  )}

                  <div className="space-y-4">
              {/* Drawing Mode Toggle */}
              <div className={`border-2 rounded-lg p-4 ${showDrawingCanvas ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400' : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300'}`}>
                <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${showDrawingCanvas ? 'text-green-900' : 'text-purple-900'}`}>
                  {showDrawingCanvas ? '✅ Drawing Mode Active' : '🎨 Drawing Mode'}
                </h3>
                <p className={`text-xs mb-3 ${showDrawingCanvas ? 'text-green-700' : 'text-purple-700'}`}>
                  {showDrawingCanvas ? 'Draw directly on the PDF page below' : 'Draw, annotate, or add lines directly on the page'}
                </p>
                <Button
                  onClick={() => setShowDrawingCanvas(!showDrawingCanvas)}
                  className={`w-full ${showDrawingCanvas ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                >
                  {showDrawingCanvas ? '✕ Close Drawing Mode' : '✏️ Start Drawing'}
                </Button>
              </div>

              <FontChanger
                currentFontName={currentFont.name}
                onFontChange={handleFontChange}
              />

              <ColorPicker
                selectedColor={inkColor}
                onChange={handleColorChange}
              />

              <FontSizeControl
                fontSize={fontSize}
                onChange={handleFontSizeChange}
              />

              <FontWeightControl
                fontWeight={fontWeight}
                onChange={handleFontWeightChange}
              />

              <LetterSpacingControl
                letterSpacing={letterSpacing}
                onChange={handleLetterSpacingChange}
              />

              <DimensionControls
                dimensions={currentPageEdit?.dimensions || DEFAULT_DIMENSIONS}
                onChange={handleDimensionsChange}
              />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer - Page Navigation */}
      <PageNavigator
        currentPage={currentPage}
        totalPages={actualPageCount || 1}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

