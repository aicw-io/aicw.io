import { Button } from '../shared';

interface AiLoadingProgressProps {
  progress: number;
  progressText: string;
  onCancel: () => void;
}

export function AiLoadingProgress({
  progress,
  progressText,
  onCancel,
}: AiLoadingProgressProps) {
  return (
    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl animate-pulse">&#10024;</span>
        <span className="font-medium text-gray-900">Loading AI Model...</span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{progressText}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Downloading model to your browser. This only happens once.
        </p>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
