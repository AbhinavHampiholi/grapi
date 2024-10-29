// src/components/Header.tsx

import React from 'react';
import { areKeysPresent } from '../utils/api';

const Header = () => (
  <div className="bg-purple-700 text-white p-2">
    <div className="container mx-auto px-4">
      {!areKeysPresent() && (
        <span className="text-red-300 font-semibold">
          ⚠️ Missing API keys in environment
        </span>
      )}
    </div>
  </div>
);

export default Header;