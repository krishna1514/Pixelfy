import { Check } from "lucide-react";

const filters = [
  { name: "Original", class: "filter-none", icon: "✨" },
  { name: "Grayscale", class: "filter-grayscale", icon: "⚫" },
  { name: "Sepia", class: "filter-sepia", icon: "🟤" },
  { name: "Warm", class: "filter-warm", icon: "🌅" },
  { name: "Cool", class: "filter-cool", icon: "❄️" },
  { name: "Vintage", class: "filter-vintage", icon: "📷" },
  { name: "Contrast", class: "filter-contrast", icon: "⚡" },
];

export function ImageFilterPanel({ imageSrc, selectedFilter, onFilterChange }) {
  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex gap-4 w-max">
        {filters.map((filter) => (
          <div
            key={filter.class}
            onClick={() => onFilterChange(filter.class)}
            className="cursor-pointer flex flex-col items-center"
          >
            <div
              className={`w-20 h-28 rounded-md border relative overflow-hidden ${
                selectedFilter === filter.class
                  ? "border-violet-500 shadow-lg"
                  : "border-gray-300"
              }`}
            >
              <img
                src={imageSrc}
                className={`w-full h-full object-cover ${filter.class}`}
              />

              {selectedFilter === filter.class && (
                <div className="absolute inset-0 bg-violet-500/20 flex justify-center items-center">
                  <Check className="text-white w-5 h-5" />
                </div>
              )}
            </div>

            <p className="mt-1 text-xs text-gray-700">{filter.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
