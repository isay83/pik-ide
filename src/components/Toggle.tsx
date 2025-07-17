// src/components/Toggle.tsx
interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

export default function Toggle({
  checked,
  onCheckedChange,
  label,
}: ToggleProps) {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span
          className={`text-sm font-semibold ${
            checked ? "text-blue-600" : "text-gray-600"
          }`}
        >
          {label}
        </span>
      )}
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-300 ${
          checked
            ? "bg-blue-500 border-blue-500"
            : "bg-gray-300 border-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-300 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
