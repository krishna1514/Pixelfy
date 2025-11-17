import { useState, useRef } from "react";
import { ImageFilterPanel } from "./ImageFilterPanel";
import { RotateCw } from "lucide-react";

const DEFAULT_ADJUSTMENTS = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  hueRotate: 0,
};

export default function ImageEditor({ image }) {
  const imgRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("filter-none");
  const [adjustments, setAdjustments] = useState(DEFAULT_ADJUSTMENTS);

  const buildCssFilterString = () => {
    return `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) blur(${adjustments.blur}px) hue-rotate(${adjustments.hueRotate}deg)`;
  };

  const handleSliderChange = (key, value) => {
    setAdjustments((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const rotateImage = () => setRotation((prev) => (prev + 90) % 360);

  const cssFilters = {
    "filter-none": "none",
    "filter-grayscale": "grayscale(100%)",
    "filter-sepia": "sepia(100%)",
    "filter-warm": "brightness(110%) sepia(20%)",
    "filter-cool": "brightness(90%) saturate(120%)",
    "filter-vintage": "sepia(60%) contrast(110%)",
    "filter-contrast": "contrast(150%)",
  };

  const getCssClassFilter = (filterClass) => cssFilters[filterClass] || "none";

  return (
    <div className="w-full space-y-8">
      {/* === IMAGE PREVIEW === */}
      <div className="flex justify-center bg-gray-100 p-4 rounded-xl shadow">
        <img
          id="edited-image"
          src={image}
          alt="preview"
          className="max-w-full max-h-[500px] rounded"
          data-rotation={rotation}
          style={{
            filter: `${buildCssFilterString()} ${getCssClassFilter(
              selectedFilter
            )}`,
            transform: `rotate(${rotation}deg)`,
          }}
        />
      </div>

      {/* === Buttons Row === */}
      <div className="flex gap-3 justify-center">
        <button
          type="button"
          onClick={rotateImage}
          className="px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-full flex items-center gap-2"
        >
          <RotateCw className="w-4 h-4" /> Rotate 90°
        </button>
      </div>

      {/* === ADJUSTMENT SLIDERS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(DEFAULT_ADJUSTMENTS).map((key) => (
          <div key={key}>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <span className="text-sm text-gray-500">{adjustments[key]}</span>
            </div>

            <input
              type="range"
              min={0}
              max={key === "hueRotate" ? 360 : key === "blur" ? 20 : 200}
              value={adjustments[key]}
              onChange={(e) => handleSliderChange(key, e.target.value)}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* === FILTER PRESETS === */}
      <ImageFilterPanel
        imageSrc={image}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
    </div>
  );
}
