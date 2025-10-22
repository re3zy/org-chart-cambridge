/**
 * Main App Component - Org Chart Plugin for Sigma Computing
 * 
 * Displays business unit hierarchies where BEBLs (employees) can appear 
 * in multiple business units as separate nodes.
 */

import { useMemo, useState, useCallback } from 'react';
import { client, useConfig, useElementData, useVariable } from '@sigmacomputing/plugin';
import { PluginConfig, OrgChartNode } from './types';
import { buildOrgChartData } from './utils/dataTransform';
import OrgChartComponent from './components/OrgChartComponent';
import SearchFilter from './components/SearchFilter';
import './App.css';

/**
 * Configure the Sigma plugin editor panel
 * Defines all the columns that need to be mapped from Sigma data
 */
client.config.configureEditorPanel([
  { name: 'source', type: 'element' },
  { name: 'beblFullName', type: 'column', source: 'source', allowMultiple: false },
  { name: 'businessUnitId', type: 'column', source: 'source', allowMultiple: false },
  { name: 'businessUnitName', type: 'column', source: 'source', allowMultiple: false },
  { name: 'level0', type: 'column', source: 'source', allowMultiple: false },
  { name: 'level1', type: 'column', source: 'source', allowMultiple: false },
  { name: 'level2', type: 'column', source: 'source', allowMultiple: false },
  { name: 'level3', type: 'column', source: 'source', allowMultiple: false },
  { name: 'level4', type: 'column', source: 'source', allowMultiple: false },
  { name: 'level5', type: 'column', source: 'source', allowMultiple: false },
  { name: 'level6', type: 'column', source: 'source', allowMultiple: false },
  { name: 'level7', type: 'column', source: 'source', allowMultiple: false },
  { name: 'level8', type: 'column', source: 'source', allowMultiple: false },
  { name: 'level9', type: 'column', source: 'source', allowMultiple: false },
  { name: 'level10', type: 'column', source: 'source', allowMultiple: false },
  { name: 'searchEnabled', type: 'variable' },
]);

/**
 * Main application component
 */
function App() {
  // Get configuration and data from Sigma
  const config = useConfig() as PluginConfig;
  const sigmaData = useElementData(config.source);
  const searchEnabledVar = useVariable(config.searchEnabled || '');

  // Local state for search
  const [searchNodeId, setSearchNodeId] = useState<string | null>(null);

  // Check if search is enabled (default to true)
  const searchEnabled = useMemo(() => {
    if (!searchEnabledVar || !Array.isArray(searchEnabledVar) || searchEnabledVar.length < 1) {
      return true;
    }
    const value = searchEnabledVar[0]?.defaultValue as { value?: boolean };
    return value?.value ?? true;
  }, [searchEnabledVar]);

  /**
   * Transform Sigma data into org chart nodes
   * Uses useMemo to avoid recalculating on every render
   */
  const orgChartData = useMemo<OrgChartNode[]>(() => {
    if (!sigmaData || !config.source) {
      return [];
    }

    try {
      return buildOrgChartData(sigmaData, config);
    } catch (error) {
      console.error('Error transforming data:', error);
      return [];
    }
  }, [sigmaData, config]);

  /**
   * Handle node selection from search
   */
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSearchNodeId(nodeId);
  }, []);

  /**
   * Handle search clear
   */
  const handleSearchClear = useCallback(() => {
    setSearchNodeId(null);
  }, []);

  /**
   * Handle node click in the chart
   */
  const handleNodeClick = useCallback((node: OrgChartNode) => {
    console.log('Node clicked:', node);
    // Can be extended to show details panel, etc.
  }, []);

  // Show loading state if no data
  if (!sigmaData || orgChartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 mb-2">
            {!sigmaData ? 'Loading data...' : 'No data to display'}
          </div>
          <div className="text-sm text-gray-600">
            {!sigmaData 
              ? 'Please wait while we fetch your organizational data'
              : 'Please configure the data source and column mappings'
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with search */}
      {searchEnabled && (
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchFilter
                nodes={orgChartData}
                onNodeSelect={handleNodeSelect}
                onClear={handleSearchClear}
              />
            </div>
            <div className="text-sm text-gray-600">
              {orgChartData.length} {orgChartData.length === 1 ? 'node' : 'nodes'}
            </div>
          </div>
        </div>
      )}

      {/* Org chart visualization */}
      <div className="flex-1 overflow-hidden">
        <OrgChartComponent
          data={orgChartData}
          searchNodeId={searchNodeId}
          onNodeClick={handleNodeClick}
        />
      </div>
    </div>
  );
}

export default App;

