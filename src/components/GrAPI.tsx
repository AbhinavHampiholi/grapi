// src/components/GrAPI.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { defaultRequests, sendRequest } from '../utils/api';
import { ViewMode, TabMode, SavedRequest } from '../types';
import Header from './Header';
import Sidebar from './Sidebar';
import RequestEditor from './RequestEditor';
import ResponseViewer from './ResponseViewer';

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
    navigator.clipboard.writeText(requestContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    try {
      setLoading(true);
      const data = await sendRequest(requestContent);
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
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedRequest={selectedRequest}
          defaultRequests={defaultRequests}
          savedRequests={savedRequests}
          onRequestSelect={handleRequestSelect}
          onLoadSaved={handleLoadSaved}
          onDeleteSaved={handleDeleteSaved}
        />

        <RequestEditor
          viewMode={viewMode}
          setViewMode={setViewMode}
          requestContent={requestContent}
          setRequestContent={setRequestContent}
          onSave={handleSaveRequest}
          onCopy={handleCopy}
          onSend={handleSend}
          copied={copied}
          loading={loading}
        />

        <ResponseViewer response={response} />
      </div>
    </div>
  );
};

export default GrAPI;