import type { ValidationError, ValidationWarning } from '@/lib/seo-tools/types';

interface ValidationResultProps {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  className?: string;
}

export function ValidationResult({
  isValid,
  errors,
  warnings,
  className = '',
}: ValidationResultProps) {
  const totalIssues = errors.length + warnings.length;
  const hasIssues = totalIssues > 0;

  const status = !isValid ? 'error' : warnings.length > 0 ? 'warning' : 'success';

  const statusConfig = {
    success: {
      title: 'Validation Passed',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-500',
      titleColor: 'text-green-800',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    warning: {
      title: 'Valid with Warnings',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-500',
      titleColor: 'text-yellow-800',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    error: {
      title: 'Validation Failed',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      titleColor: 'text-red-800',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`rounded-lg border ${config.bgColor} ${config.borderColor} ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-inherit">
        <div className="flex items-center gap-3">
          <span className={config.iconColor}>{config.icon}</span>
          <span className={`font-semibold ${config.titleColor}`}>
            {config.title}
          </span>
        </div>
        {totalIssues > 0 && (
          <span className="text-sm text-gray-600">
            {totalIssues} {totalIssues === 1 ? 'issue' : 'issues'}
          </span>
        )}
      </div>

      {/* Issues */}
      {hasIssues && (
        <div className="p-4 space-y-4">
          {/* Errors */}
          {errors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-2">Errors</h4>
              <ul className="space-y-2">
                {errors.map((error, index) => (
                  <li
                    key={`error-${index}`}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="text-red-500 mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <div>
                      <span className="text-gray-900">{error.message}</span>
                      {error.line && (
                        <span className="ml-2 text-gray-500">Line {error.line}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Warnings</h4>
              <ul className="space-y-2">
                {warnings.map((warning, index) => (
                  <li
                    key={`warning-${index}`}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="text-yellow-500 mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <div>
                      <span className="text-gray-900">{warning.message}</span>
                      {warning.suggestion && (
                        <p className="text-gray-600 mt-0.5">
                          Tip: {warning.suggestion}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
