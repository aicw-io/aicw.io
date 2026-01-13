import { useRef, useCallback } from 'react';
import { CopyButton } from './CopyButton';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readonly?: boolean;
  placeholder?: string;
  showLineNumbers?: boolean;
  errorLines?: number[];
  minHeight?: string;
  maxHeight?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = 'text',
  readonly = false,
  placeholder = '',
  showLineNumbers = true,
  errorLines = [],
  minHeight = '200px',
  maxHeight = '500px',
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lines = value.split('\n');
  const lineCount = lines.length;

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleTab = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const target = e.target as HTMLTextAreaElement;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);

        // Restore cursor position
        requestAnimationFrame(() => {
          target.selectionStart = target.selectionEnd = start + 2;
        });
      }
    },
    [value, onChange]
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {language}
        </span>
        <CopyButton text={value} size="sm" variant="ghost" />
      </div>

      {/* Editor */}
      <div
        className="flex overflow-auto"
        style={{ minHeight, maxHeight }}
      >
        {/* Line numbers */}
        {showLineNumbers && (
          <div className="flex-shrink-0 py-3 px-2 bg-gray-50 border-r border-gray-200 select-none">
            {Array.from({ length: lineCount }, (_, i) => {
              const lineNum = i + 1;
              const hasError = errorLines.includes(lineNum);
              return (
                <div
                  key={lineNum}
                  className={`
                    text-right text-sm font-mono leading-6 min-w-[2rem]
                    ${hasError ? 'text-red-500 font-semibold' : 'text-gray-400'}
                  `.trim()}
                >
                  {lineNum}
                </div>
              );
            })}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleTab}
          readOnly={readonly}
          placeholder={placeholder}
          spellCheck={false}
          className={`
            flex-1 p-3 font-mono text-sm leading-6 resize-none
            focus:outline-none
            ${readonly ? 'bg-gray-50 cursor-default' : 'bg-white'}
          `.trim()}
          style={{
            minHeight: '100%',
          }}
        />
      </div>
    </div>
  );
}
