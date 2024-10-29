// src/components/Sidebar.tsx

import React from 'react';
import { Grape, Trash2 } from 'lucide-react';
import { TabMode, RequestConfig, SavedRequest } from '../types';

interface SidebarProps {
  activeTab: TabMode;
  setActiveTab: (tab: TabMode) => void;
  selectedRequest: string;
  defaultRequests: Record<string, RequestConfig>;
  savedRequests: SavedRequest[];
  onRequestSelect: (key: string) => void;
  onLoadSaved: (request: SavedRequest) => void;
  onDeleteSaved: (timestamp: number) => void;
}

const Sidebar = ({
  activeTab,
  setActiveTab,
  selectedRequest,
  defaultRequests,
  savedRequests,
  onRequestSelect,
  onLoadSaved,
  onDeleteSaved
}: SidebarProps) => (
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
                onClick={() => onRequestSelect(key)}
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
                  onClick={() => onLoadSaved(request)}
                  className="flex-1 text-left text-gray-700"
                >
                  {request.name}
                </button>
                <button
                  onClick={() => onDeleteSaved(request.timestamp)}
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
);

export default Sidebar;