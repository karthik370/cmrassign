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
  lineSpacing: 23,
  marginLeft: 40,
  marginRight: -125,
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
  const [manuallyEditedPages, setManuallyEditedPages] = useState<Set<number>>(new Set())

  // Load fontSize, fontWeight and inkColor from current page data
  useEffect(() => {
    const currentEdit = pageEdits[currentPage]
    if (currentEdit?.text_content?.[0]) {
      const savedFontSize = currentEdit.text_content[0].fontSize
      const savedFontWeight = currentEdit.text_content[0].fontWeight
      const savedLetterSpacing = currentEdit.text_content[0].letterSpacing
      const savedColor = currentEdit.text_content[0].color
      
      if (savedFontSize && savedFontSize !== fontSize) {
        setFontSize(savedFontSize)
      }
      
      if (savedFontWeight && savedFontWeight !== fontWeight) {
        setFontWeight(savedFontWeight)
      }
      
      if (savedLetterSpacing !== undefined && savedLetterSpacing !== letterSpacing) {
        setLetterSpacing(savedLetterSpacing)
      }
      
      if (savedColor && savedColor !== inkColor) {
        setInkColor(savedColor as InkColor)
      }
    }
    
    // Also check ink_color field as fallback
    if (currentEdit?.ink_color && currentEdit.ink_color !== inkColor) {
      setInkColor(currentEdit.ink_color as InkColor)
    }
  }, [currentPage, pageEdits])

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
              text_content: [{ id: 'main', text: '', x: 0, y: 0, width: 0, height: 0, fontSize: 24, color: 'black' }],
              detected_areas: null,
              ink_color: 'black',
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
          // Initialize empty text content for each page with default dimensions
          newPageEdits[i] = {
            id: generateId(),
            project_id: project.id,
            page_number: i,
            text_content: [{ id: 'main', text: '', x: 0, y: 0, width: 0, height: 0, fontSize: 24, color: 'black' }],
            detected_areas: null,
            ink_color: 'black',
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

  // Handle overflow - sync next page with overflow text ONLY ONCE (not if manually edited)
  useEffect(() => {
    if (!actualPageCount) return
    
    const nextPage = currentPage + 1
    if (nextPage > actualPageCount) return // No next page available
    
    const nextPageEdit = pageEdits[nextPage]
    
    // CHECK: Has the next page been manually edited? If yes, DON'T auto-sync
    if (manuallyEditedPages.has(nextPage)) {
      console.log(`🚫 Page ${nextPage} was manually edited - skipping auto-sync`)
      return
    }
    
    // If there's overflow data for current page, update next page
    if (overflowData && overflowData.page === currentPage && overflowData.overflowLines.length > 0) {
      const overflowText = overflowData.overflowLines.join('\n')
      const currentNextPageText = nextPageEdit?.text_content?.[0]?.text || ''
      
      // Update next page if overflow text is different
      if (currentNextPageText !== overflowText) {
        console.log(`📝 AUTO-SYNC (ONCE): Syncing page ${nextPage} with ${overflowData.overflowLines.length} overflow lines`)
        
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
  }, [overflowData, currentPage, actualPageCount, fontSize, inkColor, pageEdits, manuallyEditedPages])
  
  // Clear overflow data when navigating away from overflow pages or when overflow is resolved
  useEffect(() => {
    if (!overflowData) return
    
    // Clear if we're not on the overflow source page or the page receiving overflow
    const isOnRelevantPage = currentPage === overflowData.page || currentPage === overflowData.page + 1
    if (!isOnRelevantPage) {
      setOverflowData(null)
    }
    
    // Clear if overflow was resolved (next page was manually edited or overflow is gone)
    if (currentPage === overflowData.page + 1) {
      const nextPageText = pageEdits[currentPage]?.text_content?.[0]?.text || ''
      const expectedOverflow = overflowData.overflowLines.join('\n')
      // If user manually edited the next page with different content, clear overflow tracking
      if (nextPageText && nextPageText !== expectedOverflow && !nextPageText.startsWith(expectedOverflow.split('\n')[0] || '')) {
        console.log('📝 Next page was manually edited, clearing overflow tracking')
        setOverflowData(null)
      }
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
    const currentEdit = pageEdits[currentPage]
    if (!currentEdit) return

    const updatedTextContent = currentEdit.text_content?.map((block) => ({
      ...block,
      color,
    })) || []

    setPageEdits({
      ...pageEdits,
      [currentPage]: {
        ...currentEdit,
        text_content: updatedTextContent,
        ink_color: color,
        updated_at: new Date().toISOString(),
      },
    })
  }

  const handleFontSizeChange = (size: number) => {
    setFontSize(size)
    const currentEdit = pageEdits[currentPage]
    if (!currentEdit) return

    const updatedTextContent = currentEdit.text_content?.map((block) => ({
      ...block,
      fontSize: size,
    })) || []

    setPageEdits({
      ...pageEdits,
      [currentPage]: {
        ...currentEdit,
        text_content: updatedTextContent,
        updated_at: new Date().toISOString(),
      },
    })
  }

  const handleFontWeightChange = (weight: number) => {
    setFontWeight(weight)
    const currentEdit = pageEdits[currentPage]
    if (!currentEdit) return

    const updatedTextContent = currentEdit.text_content?.map((block) => ({
      ...block,
      fontWeight: weight,
    })) || []

    setPageEdits({
      ...pageEdits,
      [currentPage]: {
        ...currentEdit,
        text_content: updatedTextContent,
        updated_at: new Date().toISOString(),
      },
    })
  }

  const handleLetterSpacingChange = (spacing: number) => {
    setLetterSpacing(spacing)
    const currentEdit = pageEdits[currentPage]
    if (!currentEdit) return

    const updatedTextContent = currentEdit.text_content?.map((block) => ({
      ...block,
      letterSpacing: spacing,
    })) || []

    setPageEdits({
      ...pageEdits,
      [currentPage]: {
        ...currentEdit,
        text_content: updatedTextContent,
        updated_at: new Date().toISOString(),
      },
    })
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
    const currentEdit = pageEdits[currentPage]
    if (!currentEdit) return

    setPageEdits({
      ...pageEdits,
      [currentPage]: {
        ...currentEdit,
        dimensions,
        updated_at: new Date().toISOString(),
      },
    })
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
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-sm text-gray-500">Font: {font.name} | Pages: {actualPageCount || 1}</p>
        </div>
        <div className="flex items-center gap-3">
          {isSaving && (
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              Saving...
            </span>
          )}
          {lastSaved && !isSaving && (
            <span className="text-sm text-green-600">
              Saved {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}
          {saveError && (
            <span className="text-sm text-red-600">Save failed</span>
          )}
          
          {/* Show manual download button if PDF was generated */}
          {generatedPdfUrl && (
            <a
              href={generatedPdfUrl}
              download={`${project.name}_handwritten.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Download size={18} className="mr-2" />
              Download PDF
            </a>
          )}
          
          <Button
            variant="primary"
            onClick={handleGeneratePDF}
            isLoading={isGenerating}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Generating PDF...
              </>
            ) : (
              <>
                <Download size={18} className="mr-2" />
                {generatedPdfUrl ? 'Regenerate PDF' : 'Generate PDF'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Page Thumbnails (Collapsible) */}
        {showLeftSidebar && (
          <div className="w-48 border-r bg-white flex-shrink-0">
            <PageThumbnails
              totalPages={actualPageCount || 1}
              currentPage={currentPage}
              filledPages={filledPages}
              onPageSelect={setCurrentPage}
            />
          </div>
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
                // Mark this page as manually edited to prevent auto-overflow overwriting
                setManuallyEditedPages(prev => new Set(prev).add(currentPage))
                console.log(`✏️ Page ${currentPage} marked as manually edited`)
                
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
          
          {/* Toggle Buttons - Floating */}
          <button
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            className="absolute top-4 left-4 z-10 bg-white border-2 border-gray-300 rounded-lg p-2 shadow-lg hover:bg-gray-50 transition-colors"
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
            className="absolute top-4 right-4 z-10 bg-white border-2 border-gray-300 rounded-lg p-2 shadow-lg hover:bg-gray-50 transition-colors"
            title={showRightSidebar ? "Hide tools" : "Show tools"}
          >
            {showRightSidebar ? (
              <span className="text-sm">Tools ▶</span>
            ) : (
              <span className="text-sm">◀ Tools</span>
            )}
          </button>
        </div>

        {/* Right Sidebar - Tools (Collapsible) */}
        {showRightSidebar && (
          <div className="w-72 bg-white border-l p-4 overflow-y-auto space-y-4 flex-shrink-0">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Tools
            </h2>

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

