import { type ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`
                flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm
                transition-colors duration-150
                ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `.trim()}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={`
                    ml-1 px-2 py-0.5 rounded-full text-xs font-medium
                    ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                  `.trim()}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

interface TabPanelProps {
  children: ReactNode;
  isActive: boolean;
  className?: string;
}

export function TabPanel({ children, isActive, className = '' }: TabPanelProps) {
  if (!isActive) return null;
  return <div className={className}>{children}</div>;
}
