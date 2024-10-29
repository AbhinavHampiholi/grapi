// src/components/ResponseViewer.tsx

import React from 'react';

interface ResponseViewerProps {
  response: string;
}

const ResponseViewer = ({ response }: ResponseViewerProps) => (
  <div className="w-1/3 p-4 bg-white overflow-y-auto">
    <h2 className="text-lg font-bold text-gray-900 mb-4">Response</h2>
    <pre className="w-full h-[calc(100vh-16rem)] p-4 bg-gray-50 border rounded overflow-auto font-mono text-sm text-gray-900">
      {response || '// No response yet'}
    </pre>
  </div>
);

export default ResponseViewer;