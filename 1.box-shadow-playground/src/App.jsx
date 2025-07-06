import { useState } from "react"
import DirectionSlider from "./components/DirectionSlider";
import CustomSlider from "./components/CustomSlider";

export default function BoxShadowPlayground() {
  const [shadowSettings, setShadowSettings] = useState({
    offsetX: 10,
    offsetY: 10,
    blur: 10,
    spread: 0,
    color: "#1e293b",
  })

  const updateSetting = (key, value) => {
    setShadowSettings((prev) => ({ ...prev, [key]: value }))
  }

  const shadowValue = `${shadowSettings.offsetX}px ${shadowSettings.offsetY}px ${shadowSettings.blur}px ${shadowSettings.spread}px ${shadowSettings.color}`

  return (
    <div className="min-h-screen bg-[#f1faee] p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Box Shadow Playground</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-[#a8dadc]">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Shadow Settings</h2>

            {/* 2D Direction Slider */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-800 mb-2">Shadow Direction</label>
              <DirectionSlider
                offsetX={shadowSettings.offsetX}
                offsetY={shadowSettings.offsetY}
                onOffsetChange={(x, y) => {
                  updateSetting("offsetX", x)
                  updateSetting("offsetY", y)
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>X: {shadowSettings.offsetX}px</span>
                <span>Y: {shadowSettings.offsetY}px</span>
              </div>
            </div>

            {/* Blur Slider */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Blur Radius: {shadowSettings.blur}px
              </label>
              <CustomSlider
                value={shadowSettings.blur}
                onChange={(value) => updateSetting("blur", value)}
                min={0}
                max={50}
              />
            </div>

            {/* Spread Slider */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Spread Radius: {shadowSettings.spread}px
              </label>
              <CustomSlider
                value={shadowSettings.spread}
                onChange={(value) => updateSetting("spread", value)}
                min={-20}
                max={20}
              />
            </div>

            {/* Color Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-800 mb-2">Shadow Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={shadowSettings.color}
                  onChange={(e) => updateSetting("color", e.target.value)}
                  className="w-10 h-10 rounded-lg border-2 border-[#a8dadc] cursor-pointer"
                />
                <input
                  type="text"
                  value={shadowSettings.color}
                  onChange={(e) => updateSetting("color", e.target.value)}
                  className="flex-1 px-3 py-2 border-2 border-[#a8dadc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* CSS Output */}
            <div className="bg-gray-50 rounded-lg p-3 border-2 border-gray-200">
              <label className="block text-sm font-medium text-slate-800 mb-1">CSS Output</label>
              <code className="text-xs text-slate-800 break-all">box-shadow: {shadowValue};</code>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-[#a8dadc]">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Preview</h2>

            <div className="flex items-center justify-center h-64">
              <div
                className="w-24 h-24 bg-[#a8dadc] rounded-xl"
                style={{
                  boxShadow: shadowValue,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

