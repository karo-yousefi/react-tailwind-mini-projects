import { useState, useCallback, useRef, useEffect} from "react"

export default function DirectionSlider({ offsetX, offsetY, onOffsetChange }) {
  const containerRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const x = e.clientX - rect.left - centerX
      const y = e.clientY - rect.top - centerY

      // Constrain to container bounds
      const maxX = centerX - 10
      const maxY = centerY - 10
      const constrainedX = Math.max(-maxX, Math.min(maxX, x))
      const constrainedY = Math.max(-maxY, Math.min(maxY, y))

      // Convert to shadow offset values (-50 to 50)
      const offsetX = Math.round((constrainedX / maxX) * 50)
      const offsetY = Math.round((constrainedY / maxY) * 50)

      onOffsetChange(offsetX, offsetY)
    },
    [isDragging, onOffsetChange],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragging(true)

      // Also handle the initial click position
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const x = e.clientX - rect.left - centerX
      const y = e.clientY - rect.top - centerY

      const maxX = centerX - 10
      const maxY = centerY - 10
      const constrainedX = Math.max(-maxX, Math.min(maxX, x))
      const constrainedY = Math.max(-maxY, Math.min(maxY, y))

      const offsetX = Math.round((constrainedX / maxX) * 50)
      const offsetY = Math.round((constrainedY / maxY) * 50)

      onOffsetChange(offsetX, offsetY)
    },
    [onOffsetChange],
  )

  // Calculate handle position from offset values
  const containerSize = 140
  const handleSize = 18
  const maxOffset = (containerSize - handleSize) / 2
  const handleX = (offsetX / 50) * maxOffset + containerSize / 2 - handleSize / 2
  const handleY = (offsetY / 50) * maxOffset + containerSize / 2 - handleSize / 2

  return (
    <div
      ref={containerRef}
      className="relative w-[140px] h-[140px] bg-gray-100 rounded-xl border-2 border-[#a8dadc] mx-auto cursor-crosshair"
      style={{ userSelect: "none" }}
      onMouseDown={handleMouseDown}
    >
      {/* Center lines */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 transform -translate-y-px" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-px" />

      {/* Handle */}
      <div
        className="absolute w-[18px] h-[18px] bg-[#e63946] rounded-full border-2 border-white shadow-md cursor-grab active:cursor-grabbing pointer-events-none"
        style={{
          left: `${handleX}px`,
          top: `${handleY}px`,
        }}
      />
    </div>
  )
}