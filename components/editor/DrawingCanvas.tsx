'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Pen, Eraser, Minus, RotateCcw, RotateCw, Trash2, Move } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type DrawingTool = 'pen' | 'eraser' | 'line'

interface Point {
  x: number
  y: number
}

interface DrawingStroke {
  tool: DrawingTool
  points: Point[]
  thickness: number
  color: string
}

interface DrawingCanvasProps {
  pageNumber: number
  width: number
  height: number
  initialDrawing?: DrawingStroke[]
  onDrawingChange?: (drawing: DrawingStroke[]) => void
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  pageNumber,
  width,
  height,
  initialDrawing = [],
  onDrawingChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<DrawingTool>('pen')
  const [thickness, setThickness] = useState(2)
  const [strokes, setStrokes] = useState<DrawingStroke[]>(initialDrawing)
  const [currentStroke, setCurrentStroke] = useState<Point[]>([])
  const [undoStack, setUndoStack] = useState<DrawingStroke[][]>([])
  const [redoStack, setRedoStack] = useState<DrawingStroke[][]>([])
  
  // Draggable toolbar state
  const [toolbarPosition, setToolbarPosition] = useState({ x: 8, y: 8 })
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Load initial drawing
  useEffect(() => {
    if (initialDrawing.length > 0) {
      setStrokes(initialDrawing)
      redrawCanvas(initialDrawing)
    }
  }, [initialDrawing])

  // Redraw canvas whenever strokes change
  useEffect(() => {
    redrawCanvas(strokes)
  }, [strokes])

  const redrawCanvas = (strokesToDraw: DrawingStroke[]) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw all strokes
    strokesToDraw.forEach((stroke) => {
      if (stroke.points.length < 2) return

      ctx.beginPath()
      
      // Use destination-out for eraser to actually erase on transparent background
      if (stroke.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.strokeStyle = 'rgba(0,0,0,1)' // Color doesn't matter for destination-out
      } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = stroke.color
      }
      
      ctx.lineWidth = stroke.thickness
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (stroke.tool === 'line' && stroke.points.length === 2) {
        // Draw straight line
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
        ctx.lineTo(stroke.points[1].x, stroke.points[1].y)
      } else {
        // Draw freehand stroke
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
        }
      }

      ctx.stroke()
      ctx.globalCompositeOperation = 'source-over' // Reset to default
    })
  }

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const pos = getMousePos(e)
    setCurrentStroke([pos])
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const pos = getMousePos(e)
    const newStroke = [...currentStroke, pos]
    setCurrentStroke(newStroke)

    // Draw current stroke in real-time
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (currentTool === 'line') {
      // For line tool, redraw everything and show preview
      redrawCanvas(strokes)
      ctx.beginPath()
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = thickness
      ctx.lineCap = 'round'
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else {
      // For pen/eraser, draw incrementally
      ctx.beginPath()
      
      // Use destination-out for eraser to actually erase
      if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.strokeStyle = 'rgba(0,0,0,1)'
      } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = '#000000'
      }
      
      ctx.lineWidth = thickness
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const prevPoint = currentStroke[currentStroke.length - 1]
      ctx.moveTo(prevPoint.x, prevPoint.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
      ctx.globalCompositeOperation = 'source-over' // Reset
    }
  }

  const handleMouseUp = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    if (currentStroke.length < 2) return

    // Save current state for undo
    setUndoStack([...undoStack, strokes])
    setRedoStack([]) // Clear redo stack on new action

    const newStroke: DrawingStroke = {
      tool: currentTool,
      points: currentTool === 'line' ? [currentStroke[0], currentStroke[currentStroke.length - 1]] : currentStroke,
      thickness: thickness,
      color: '#000000',
    }

    const newStrokes = [...strokes, newStroke]
    setStrokes(newStrokes)
    setCurrentStroke([])

    // Notify parent
    if (onDrawingChange) {
      onDrawingChange(newStrokes)
    }
  }

  const handleUndo = () => {
    if (undoStack.length === 0) return

    const previousState = undoStack[undoStack.length - 1]
    setRedoStack([...redoStack, strokes])
    setUndoStack(undoStack.slice(0, -1))
    setStrokes(previousState)

    if (onDrawingChange) {
      onDrawingChange(previousState)
    }
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return

    const nextState = redoStack[redoStack.length - 1]
    setUndoStack([...undoStack, strokes])
    setRedoStack(redoStack.slice(0, -1))
    setStrokes(nextState)

    if (onDrawingChange) {
      onDrawingChange(nextState)
    }
  }

  const handleClear = () => {
    if (strokes.length === 0) return

    setUndoStack([...undoStack, strokes])
    setRedoStack([])
    setStrokes([])

    if (onDrawingChange) {
      onDrawingChange([])
    }
  }

  // Toolbar drag handlers
  const handleToolbarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingToolbar(true)
    setDragOffset({
      x: e.clientX - toolbarPosition.x,
      y: e.clientY - toolbarPosition.y
    })
  }

  const handleToolbarMouseMove = (e: MouseEvent) => {
    if (!isDraggingToolbar) return
    e.preventDefault()
    setToolbarPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    })
  }

  const handleToolbarMouseUp = () => {
    setIsDraggingToolbar(false)
  }

  // Add/remove toolbar drag listeners
  useEffect(() => {
    if (isDraggingToolbar) {
      window.addEventListener('mousemove', handleToolbarMouseMove)
      window.addEventListener('mouseup', handleToolbarMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleToolbarMouseMove)
        window.removeEventListener('mouseup', handleToolbarMouseUp)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDraggingToolbar])

  return (
    <div className="relative">
      {/* Drawing Tools */}
      <div 
        className="absolute bg-white rounded-lg shadow-lg p-2 z-10 space-y-2"
        style={{ 
          left: `${toolbarPosition.x}px`, 
          top: `${toolbarPosition.y}px`,
          cursor: isDraggingToolbar ? 'grabbing' : 'auto'
        }}
      >
        {/* Drag Handle */}
        <div
          onMouseDown={handleToolbarMouseDown}
          className="flex items-center justify-center gap-1 p-2 bg-gray-100 rounded cursor-grab active:cursor-grabbing hover:bg-gray-200 mb-2"
          title="Drag to move"
        >
          <Move size={16} className="text-gray-600" />
          <span className="text-xs font-medium text-gray-700">Move Toolbar</span>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentTool('pen')}
            className={`p-2 rounded ${
              currentTool === 'pen' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title="Pen"
          >
            <Pen size={20} />
          </button>
          <button
            onClick={() => setCurrentTool('eraser')}
            className={`p-2 rounded ${
              currentTool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title="Eraser"
          >
            <Eraser size={20} />
          </button>
          <button
            onClick={() => setCurrentTool('line')}
            className={`p-2 rounded ${
              currentTool === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title="Draw Line"
          >
            <Minus size={20} />
          </button>
        </div>

        {/* Thickness Control */}
        <div className="px-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Thickness: {thickness}px
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={thickness}
            onChange={(e) => setThickness(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="border-t pt-2 flex gap-1">
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <RotateCw size={18} />
          </button>
          <button
            onClick={handleClear}
            disabled={strokes.length === 0}
            className="p-2 rounded bg-red-100 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed text-red-600"
            title="Clear All"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="cursor-crosshair border border-gray-300 bg-transparent"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </div>
  )
}
