"use client";

import React, { useState } from 'react';
import { Send, RefreshCw, Grape, Copy, Check } from 'lucide-react';

const GREPTILE_API_KEY = process.env.NEXT_PUBLIC_GREPTILE_API_KEY;
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

const defaultRequests = {
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
        content: "Explain the code responsible for generating the changelog",
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
  const [copied, setCopied] = useState(false);
  const [requestContent, setRequestContent] = useState<string>(
    JSON.stringify(defaultRequests[Object.keys(defaultRequests)[0]], null, 2)
  );
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(requestContent);
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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-purple-700 text-white p-4">
        <div className="container mx-auto px-4 flex items-center">
          <div className="flex items-center gap-2">
            <Grape size={24} />
            <h1 className="text-xl font-bold">grAPI</h1>
          </div>
          {(!GREPTILE_API_KEY || !GITHUB_TOKEN) && (
            <span className="ml-auto text-red-300 font-semibold">
              ⚠️ Missing API keys in environment
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* API List Section */}
        <div className="w-1/3 p-4 border-r border-gray-200 bg-white overflow-y-auto">
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
        </div>

        {/* Request Editor Section */}
        <div className="w-1/3 p-4 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Request</h2>
            <div className="flex items-center gap-2">
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
          <textarea
            value={requestContent}
            onChange={(e) => setRequestContent(e.target.value)}
            className="w-full h-[calc(100vh-16rem)] p-4 font-mono text-sm border rounded bg-white text-gray-900 resize-none"
            spellCheck={false}
          />
        </div>

        {/* Response Section */}
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