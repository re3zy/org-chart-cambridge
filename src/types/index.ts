/**
 * Type definitions for the Org Chart Plugin
 */

/**
 * Node structure compatible with d3-org-chart library
 */
export interface OrgChartNode {
  id: string;
  parentId: string | null;
  name: string;
  businessUnit: string;
  beblCode?: string;
  businessUnitCode?: string;
  _directSubordinates?: number;
  _totalSubordinates?: number;
}

/**
 * Parsed level string containing extracted information
 * Format: "Name (BU_Code)-BEBL_Code"
 */
export interface ParsedLevelInfo {
  name: string;
  businessUnitCode: string;
  beblCode: string;
  raw: string;
}

/**
 * Configuration from Sigma plugin editor panel
 */
export interface PluginConfig {
  source: string;
  beblFullName: string;
  businessUnitId: string;
  businessUnitName: string;
  level0: string;
  level1?: string;
  level2?: string;
  level3?: string;
  level4?: string;
  level5?: string;
  level6?: string;
  level7?: string;
  level8?: string;
  level9?: string;
  level10?: string;
  searchEnabled?: string;
}

/**
 * Raw data row from Sigma
 */
export interface SigmaDataRow {
  beblFullName: string;
  businessUnitId: string;
  businessUnitName: string;
  businessUnitCode?: string;
  businessUnitLevel?: number;
  level0: string | null;
  level1: string | null;
  level2: string | null;
  level3: string | null;
  level4: string | null;
  level5: string | null;
  level6: string | null;
  level7: string | null;
  level8: string | null;
  level9: string | null;
  level10: string | null;
}

/**
 * Sigma data structure (columnar format)
 */
export type SigmaData = {
  [columnId: string]: any[];
};

/**
 * Search result item
 */
export interface SearchResult {
  nodeId: string;
  name: string;
  businessUnit: string;
  beblCode?: string;
}

