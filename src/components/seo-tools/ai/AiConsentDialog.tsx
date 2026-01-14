import { useState } from 'react';
import { Button } from '../shared';
import { AI_REQUIREMENTS } from './constants';

interface AiConsentDialogProps {
  onAccept: (dontAskAgain: boolean) => void;
  onCancel: () => void;
  hasLowMemory?: boolean;
}

export function AiConsentDialog({
  onAccept,
  onCancel,
  hasLowMemory,
}: AiConsentDialogProps) {
  const [dontAskAgain, setDontAskAgain] = useState(false);

  return (
    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">&#10024;</span>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Enable AI-Powered Generation
          </h3>
          <p className="text-sm text-gray-600">
            Describe your content in plain English and let AI generate the
            output automatically. Everything runs in your browser.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <span className="text-amber-600">&#9888;&#65039;</span>
          <div className="text-sm">
            <p className="font-medium text-amber-800 mb-2">
              Before you continue:
            </p>
            <ul className="space-y-1 text-amber-700">
              <li>
                &#8226; Downloads ~{AI_REQUIREMENTS.modelSize}MB AI model
                (one-time, cached locally)
              </li>
              <li>
                &#8226; Requires {AI_REQUIREMENTS.minRam}GB+ RAM for smooth
                performance
              </li>
              <li>&#8226; Needs Chrome/Edge 113+ with WebGPU support</li>
              <li>
                &#8226; First load takes {AI_REQUIREMENTS.downloadTime} on
                typical connection
              </li>
            </ul>
            {hasLowMemory && (
              <p className="mt-2 text-amber-800 font-medium">
                &#9888;&#65039; Low memory detected on your device. Performance
                may be affected.
              </p>
            )}
            <p className="mt-2 text-amber-700">
              On devices with less memory, your browser may slow down or become
              unresponsive.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="dont-ask-again"
          checked={dontAskAgain}
          onChange={(e) => setDontAskAgain(e.target.checked)}
          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <label htmlFor="dont-ask-again" className="text-sm text-gray-600">
          Don't ask again on this device
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => onAccept(dontAskAgain)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Download &amp; Enable
        </Button>
      </div>
    </div>
  );
}
