"use client"

import { useState, useEffect } from "react"

export default function ColorPickerApp() {
  const [currentColor, setCurrentColor] = useState("#ff6b6b")
  const [rgbValues, setRgbValues] = useState({ r: 255, g: 107, b: 107 })
  const [showToast, setShowToast] = useState(false)

  // Load last selected color from localStorage on mount
  useEffect(() => {
    const savedColor = localStorage.getItem("lastSelectedColor")
    if (savedColor) {
      updateFromHex(savedColor)
    }
  }, [])

  // Color conversion functions
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  const rgbToHsl = (r, g, b) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h,
      s,
      l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const rgbToHsv = (r, g, b) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h,
      s,
      v = max

    const d = max - min
    s = max === 0 ? 0 : d / max

    if (max === min) {
      h = 0
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    }
  }

  const rgbToCmyk = (r, g, b) => {
    r /= 255
    g /= 255
    b /= 255

    const k = 1 - Math.max(r, Math.max(g, b))
    const c = (1 - r - k) / (1 - k) || 0
    const m = (1 - g - k) / (1 - k) || 0
    const y = (1 - b - k) / (1 - k) || 0

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    }
  }

  const rgbToLab = (r, g, b) => {
    r = r / 255
    g = g / 255
    b = b / 255

    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

    let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
    let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0
    let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883

    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116

    return {
      l: Math.round(116 * y - 16),
      a: Math.round(500 * (x - y)),
      b: Math.round(200 * (y - z)),
    }
  }

  // Save last selected color to localStorage
  const saveLastColor = (hex) => {
    localStorage.setItem("lastSelectedColor", hex)
  }

  // Update functions
  const updateFromHex = (hex) => {
    const rgb = hexToRgb(hex)
    if (rgb) {
      setCurrentColor(hex)
      setRgbValues(rgb)
      saveLastColor(hex)
    }
  }

  const updateFromRGB = (r, g, b) => {
    const hex = rgbToHex(r, g, b)
    setCurrentColor(hex)
    setRgbValues({ r, g, b })
    saveLastColor(hex)
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  // Get all color formats
  const getColorFormats = () => {
    const { r, g, b } = rgbValues
    const hsl = rgbToHsl(r, g, b)
    const hsv = rgbToHsv(r, g, b)
    const cmyk = rgbToCmyk(r, g, b)
    const lab = rgbToLab(r, g, b)

    return {
      hex: currentColor.toUpperCase(),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
      lab: `lab(${lab.l}, ${lab.a}, ${lab.b})`,
    }
  }

  const presetColors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#ff9f43",
    "#10ac84",
    "#ee5a24",
    "#0abde3",
    "#3867d6",
    "#8854d0",
    "#a55eea",
    "#26de81",
    "#fd79a8",
    "#fdcb6e",
    "#6c5ce7",
  ]

  const formats = getColorFormats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-rose-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-500 to-rose-400 bg-clip-text text-transparent mb-2">
            Color Picker
          </h1>
        </header>

        <div className="space-y-8">
          {/* Color Picker Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50">
            <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
              <div className="flex justify-center">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => updateFromHex(e.target.value)}
                  className="w-25 h-25 border-4 border-white shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-200"
                />
              </div>
            </div>

            {/* RGB Sliders */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="min-w-16 font-semibold text-stone-700">Red</label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbValues.r}
                  onChange={(e) => updateFromRGB(Number.parseInt(e.target.value), rgbValues.g, rgbValues.b)}
                  className="flex-1 h-3 bg-gradient-to-r from-black to-red-500 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="min-w-12 text-center font-semibold text-stone-600">{rgbValues.r}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="min-w-16 font-semibold text-stone-700">Green</label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbValues.g}
                  onChange={(e) => updateFromRGB(rgbValues.r, Number.parseInt(e.target.value), rgbValues.b)}
                  className="flex-1 h-3 bg-gradient-to-r from-black to-green-500 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="min-w-12 text-center font-semibold text-stone-600">{rgbValues.g}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="min-w-16 font-semibold text-stone-700">Blue</label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={rgbValues.b}
                  onChange={(e) => updateFromRGB(rgbValues.r, rgbValues.g, Number.parseInt(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-black to-blue-500 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="min-w-12 text-center font-semibold text-stone-600">{rgbValues.b}</span>
              </div>
            </div>
          </div>

          {/* Color Formats Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50">
            <h2 className="text-2xl font-semibold text-stone-800 mb-6">Color Formats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(formats).map(([format, value]) => (
                <div key={format} className="space-y-2">
                  <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider">
                    {format}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={value}
                      readOnly
                      className="flex-1 px-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-xl font-mono text-sm text-stone-800 focus:border-rose-400 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={() => copyToClipboard(value)}
                      className="px-6 py-3 bg-gradient-to-r from-violet-500 to-rose-400 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preset Colors */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50">
            <h2 className="text-2xl font-semibold text-stone-800 mb-6">Color Presets</h2>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-4">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => updateFromHex(color)}
                  className="w-12 h-12 rounded-xl border-4 border-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-8 right-8 bg-stone-800 text-white px-6 py-4 rounded-xl font-semibold shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            Color copied to clipboard!
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          border: 3px solid #e5e7eb;
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          border: 3px solid #e5e7eb;
        }
      `}</style>
    </div>
  )
}
