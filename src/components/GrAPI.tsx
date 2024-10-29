"use client";

import React, { useState, useEffect } from 'react';
import { Send, RefreshCw, Grape, Copy, Check, Braces, Save, Trash2 } from 'lucide-react';
import ViewModeToggle from './ViewModeToggle';

const GREPTILE_API_KEY = process.env.NEXT_PUBLIC_GREPTILE_API_KEY;
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

interface RequestConfig {
  method: string;
  url: string;
  body: any;
}

interface SavedRequest extends RequestConfig {
  name: string;
  timestamp: number;
}

type ViewMode = 'json' | 'curl';
type TabMode = 'endpoints' | 'saved';

const generateCurlCommand = (request: RequestConfig): string => {
  const parts = [`curl -X ${request.method} '${request.url}'`];
  
  // Add headers
  parts.push(`  -H 'Authorization: Bearer ${GREPTILE_API_KEY}'`);
  parts.push(`  -H 'X-Github-Token: ${GITHUB_TOKEN}'`);
  parts.push(`  -H 'Content-Type: application/json'`);
  
  // Add body for non-GET requests
  if (request.method !== 'GET' && request.body) {
    parts.push(`  -d '${JSON.stringify(request.body)}'`);
  }
  
  return parts.join(' \\\n');
};

const defaultRequests: Record<string, RequestConfig> = {
  'Submit Repository': {
    method: 'POST',
    url: 'https://api.greptile.com/v2/repositories',
    body: {
      remote: "github",
      repository: "AbhinavHampiholi/gramphibian",
      branch: "main"
    }
  },
  'Check Index Status': {
    method: 'GET',
    url: 'https://api.greptile.com/v2/repositories/github:main:AbhinavHampiholi/gramphibian',
    body: null
  },
  'Query Repository': {
    method: 'POST',
    url: 'https://api.greptile.com/v2/query',
    body: {
      messages: [{
        content: "Explain the code that generates the changelog",
        role: "user"
      }],
      repositories: [{
        remote: "github",
        repository: "AbhinavHampiholi/gramphibian",
        branch: "main"
      }],
      genius: true
    }
  }
};

const GrAPI = () => {
  const [selectedRequest, setSelectedRequest] = useState<string>(Object.keys(defaultRequests)[0]);
  const [viewMode, setViewMode] = useState<ViewMode>('json');
  const [activeTab, setActiveTab] = useState<TabMode>('endpoints');
  const [requestContent, setRequestContent] = useState<string>(
    JSON.stringify(defaultRequests[Object.keys(defaultRequests)[0]], null, 2)
  );
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
  const [copied, setCopied] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('savedRequests');
    if (saved) {
      setSavedRequests(JSON.parse(saved));
    }
  }, []);

  const handleCopy = () => {
    const contentToCopy = viewMode === 'curl' 
      ? generateCurlCommand(JSON.parse(requestContent))
      : requestContent;
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    try {
      setLoading(true);
      const request = JSON.parse(requestContent);
      
      let url = request.url;
      if (request.url.includes('/repositories/github:')) {
        const parts = url.split('/repositories/');
        url = `${parts[0]}/repositories/${encodeURIComponent(parts[1])}`;
      }

      const res = await fetch(url, {
        method: request.method,
        headers: {
          'Authorization': `Bearer ${GREPTILE_API_KEY}`,
          'X-Github-Token': GITHUB_TOKEN,
          'Content-Type': 'application/json'
        },
        body: request.method !== 'GET' ? JSON.stringify(request.body) : null,
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSelect = (key: string) => {
    setSelectedRequest(key);
    setRequestContent(JSON.stringify(defaultRequests[key], null, 2));
    setResponse('');
  };

  const handleSaveRequest = () => {
    try {
      const request = JSON.parse(requestContent);
      const name = prompt('Enter a name for this request:');
      if (!name) return;

      const newSavedRequest: SavedRequest = {
        ...request,
        name,
        timestamp: Date.now()
      };

      const updatedRequests = [...savedRequests, newSavedRequest];
      setSavedRequests(updatedRequests);
      localStorage.setItem('savedRequests', JSON.stringify(updatedRequests));
    } catch (error) {
      alert('Invalid JSON in request');
    }
  };

  const handleDeleteSaved = (timestamp: number) => {
    const updatedRequests = savedRequests.filter(req => req.timestamp !== timestamp);
    setSavedRequests(updatedRequests);
    localStorage.setItem('savedRequests', JSON.stringify(updatedRequests));
  };

  const handleLoadSaved = (request: SavedRequest) => {
    setRequestContent(JSON.stringify(request, null, 2));
    setResponse('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-purple-700 text-white p-2">
        <div className="container mx-auto px-4">
          {(!GREPTILE_API_KEY || !GITHUB_TOKEN) && (
            <span className="text-red-300 font-semibold">
              ⚠️ Missing API keys in environment
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Grape size={24} className="text-purple-700" />
              <h1 className="text-xl font-bold text-purple-700">grAPI</h1>
            </div>
          </div>
          
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('endpoints')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'endpoints'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Endpoints
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'saved'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Saved Requests
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'endpoints' ? (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Endpoints</h2>
                <div className="space-y-2">
                  {Object.keys(defaultRequests).map((key) => (
                    <button
                      key={key}
                      onClick={() => handleRequestSelect(key)}
                      className={`w-full text-left p-2 rounded ${
                        selectedRequest === key 
                          ? 'bg-purple-100 text-purple-900 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Saved Requests</h2>
                <div className="space-y-2">
                  {savedRequests.map((request) => (
                    <div
                      key={request.timestamp}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded group"
                    >
                      <button
                        onClick={() => handleLoadSaved(request)}
                        className="flex-1 text-left text-gray-700"
                      >
                        {request.name}
                      </button>
                      <button
                        onClick={() => handleDeleteSaved(request.timestamp)}
                        className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete request"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {savedRequests.length === 0 && (
                    <p className="text-gray-500 text-sm">No saved requests yet</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-1/3 p-4 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Request</h2>
            <div className="flex items-center gap-2">
              <ViewModeToggle 
                viewMode={viewMode} 
                onChange={setViewMode} 
              />
              <button
                onClick={handleSaveRequest}
                className="p-2 text-gray-600 hover:text-gray-900"
                title="Save request"
              >
                <Save size={16} />
              </button>
              <button
                onClick={handleCopy}
                className="p-2 text-gray-600 hover:text-gray-900"
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button
                onClick={handleSend}
                disabled={loading || !GREPTILE_API_KEY || !GITHUB_TOKEN}
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

        <div className="w-1/3 p-4 bg-white overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Response</h2>
          <pre className="w-full h-[calc(100vh-16rem)] p-4 bg-gray-50 border rounded overflow-auto font-mono text-sm text-gray-900">
            {response || '// No response yet'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default GrAPI;