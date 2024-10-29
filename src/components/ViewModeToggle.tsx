import React from 'react';
import { Code2, Braces } from 'lucide-react';

const ViewModeToggle = ({ viewMode, onChange }) => {
  return (
    <div className="flex rounded-md border border-gray-200 overflow-hidden">
      <button
        onClick={() => onChange('json')}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm ${
          viewMode === 'json'
            ? 'bg-purple-100 text-purple-900'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Braces size={16} />
        JSON
      </button>
      <button
        onClick={() => onChange('curl')}
        className={`flex items-center gap-1 px-3 py-1.5 text-sm border-l ${
          viewMode === 'curl'
            ? 'bg-purple-100 text-purple-900'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Code2 size={16} />
        CURL
      </button>
    </div>
  );
};

export default ViewModeToggle;