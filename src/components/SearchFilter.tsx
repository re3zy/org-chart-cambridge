/**
 * SearchFilter - Search component for finding nodes in the org chart
 */

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { OrgChartNode } from '../types';
import { searchNodes } from '../utils/dataTransform';

interface SearchFilterProps {
  nodes: OrgChartNode[];
  onNodeSelect: (nodeId: string) => void;
  onClear: () => void;
}

/**
 * Search filter component with autocomplete dropdown
 * 
 * Features:
 * - Search by name, BEBL code, or business unit
 * - Case-insensitive partial matching
 * - Dropdown with results
 * - Clear button
 */
export default function SearchFilter({
  nodes,
  onNodeSelect,
  onClear,
}: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search results based on current search term
  const results = useMemo(() => {
    return searchNodes(nodes, searchTerm);
  }, [nodes, searchTerm]);

  /**
   * Handle search input change
   */
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.trim().length > 0);
    setSelectedIndex(-1);
  }, []);

  /**
   * Handle result selection
   */
  const handleResultClick = useCallback((nodeId: string) => {
    onNodeSelect(nodeId);
    setShowDropdown(false);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setSearchTerm(node.name);
    }
  }, [nodes, onNodeSelect]);

  /**
   * Handle clear button
   */
  const handleClear = useCallback(() => {
    setSearchTerm('');
    setShowDropdown(false);
    setSelectedIndex(-1);
    onClear();
    inputRef.current?.focus();
  }, [onClear]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  }, [showDropdown, results, selectedIndex, handleResultClick]);

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder="Search by name, BEBL code, or business unit..."
          className="w-full px-4 py-2 pr-20 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {results.map((node, index) => (
            <button
              key={node.id}
              onClick={() => handleResultClick(node.id)}
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <div className="font-medium text-sm text-gray-900">{node.name}</div>
              <div className="text-xs text-gray-600 mt-1">{node.businessUnit}</div>
              {node.beblCode && (
                <div className="text-xs text-gray-500 mt-0.5">Code: {node.beblCode}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showDropdown && searchTerm && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3">
          <div className="text-sm text-gray-600">No results found</div>
        </div>
      )}
    </div>
  );
}

