// src/components/RequestEditor.tsx

import React from 'react';
import { Send, RefreshCw, Copy, Check, Save } from 'lucide-react';
import { ViewMode } from '../types';
import ViewModeToggle from './ViewModeToggle';
import { generateCurlCommand, areKeysPresent } from '../utils/api';

interface RequestEditorProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  requestContent: string;
  setRequestContent: (content: string) => void;
  onSave: () => void;
  onCopy: () => void;
  onSend: () => void;
  copied: boolean;
  loading: boolean;
}

const RequestEditor = ({
  viewMode,
  setViewMode,
  requestContent,
  setRequestContent,
  onSave,
  onCopy,
  onSend,
  copied,
  loading
}: RequestEditorProps) => (
  <div className="w-1/3 p-4 border-r border-gray-200 bg-white overflow-y-auto">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold text-gray-900">Request</h2>
      <div className="flex items-center gap-2">
        <ViewModeToggle 
          viewMode={viewMode} 
          onChange={setViewMode} 
        />
        <button
          onClick={onSave}
          className="p-2 text-gray-600 hover:text-gray-900"
          title="Save request"
        >
          <Save size={16} />
        </button>
        <button
          onClick={onCopy}
          className="p-2 text-gray-600 hover:text-gray-900"
          title="Copy to clipboard"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
        <button
          onClick={onSend}
          disabled={loading || !areKeysPresent()}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
          Send
        </button>
      </div>
    </div>

    {viewMode === 'json' ? (
      <textarea
        value={requestContent}
        onChange={(e) => setRequestContent(e.target.value)}
        className="w-full h-[calc(100vh-16rem)] p-4 font-mono text-sm border rounded bg-white text-gray-900 resize-none"
        spellCheck={false}
      />
    ) : (
      <pre className="w-full h-[calc(100vh-16rem)] p-4 bg-gray-50 border rounded text-sm font-mono text-gray-900 overflow-auto">
        {(() => {
          try {
            return generateCurlCommand(JSON.parse(requestContent));
          } catch (e) {
            return '// Invalid JSON in request';
          }
        })()}
      </pre>
    )}
  </div>
);

export default RequestEditor;