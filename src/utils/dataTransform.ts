/**
 * Data transformation utilities for converting Sigma hierarchical data
 * into d3-org-chart compatible format
 */

import { OrgChartNode, ParsedLevelInfo, SigmaData, PluginConfig } from '../types';

/**
 * Parses a level string in the format "Name (BU_Code)-BEBL_Code"
 * Example: "Cambridge Investment Research, Inc. (00001)-QV6"
 * 
 * @param levelString - The level string to parse
 * @returns Parsed level information or null if invalid
 */
export function parseLevelString(levelString: string | null): ParsedLevelInfo | null {
  if (!levelString || typeof levelString !== 'string') {
    return null;
  }

  // Pattern: "Name (BU_Code)-BEBL_Code"
  const pattern = /^(.+?)\s*\(([^)]+)\)-([^-]+)$/;
  const match = levelString.match(pattern);

  if (!match) {
    console.warn(`Failed to parse level string: ${levelString}`);
    return null;
  }

  return {
    name: match[1].trim(),
    businessUnitCode: match[2].trim(),
    beblCode: match[3].trim(),
    raw: levelString,
  };
}

/**
 * Builds org chart nodes from Sigma data with level columns
 * 
 * Key logic:
 * - Iterates through each row in the source data
 * - Extracts level hierarchy from Level 0 through Level 10
 * - Constructs unique nodes for each path segment
 * - Establishes parent-child relationships based on level sequence
 * - Cambridge Investment Research (Level 0) becomes root with parentId: null
 * 
 * @param sigmaData - Columnar data from Sigma
 * @param config - Plugin configuration with column mappings
 * @returns Array of org chart nodes
 */
export function buildOrgChartData(
  sigmaData: SigmaData,
  config: PluginConfig
): OrgChartNode[] {
  const nodes: OrgChartNode[] = [];
  const nodeMap = new Map<string, OrgChartNode>();

  // Validate required columns exist
  if (!sigmaData[config.level0] || !sigmaData[config.beblFullName] || !sigmaData[config.businessUnitId]) {
    console.warn('Missing required columns in data');
    return [];
  }

  const numRows = sigmaData[config.level0].length;

  // Process each row
  for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
    // Collect all level values for this row (filter out nulls/undefined)
    const levelColumns = [
      'level0', 'level1', 'level2', 'level3', 'level4',
      'level5', 'level6', 'level7', 'level8', 'level9', 'level10'
    ];

    const levels: string[] = [];
    for (const levelCol of levelColumns) {
      const configKey = config[levelCol as keyof PluginConfig];
      if (configKey && sigmaData[configKey as string]) {
        const value = sigmaData[configKey as string][rowIdx];
        if (value) {
          levels.push(value);
        } else {
          // Stop at first null/undefined level
          break;
        }
      }
    }

    // Skip rows with no valid levels
    if (levels.length === 0) {
      continue;
    }

    // Build nodes for each level in this hierarchy path
    let parentPath = '';
    for (let levelIdx = 0; levelIdx < levels.length; levelIdx++) {
      const levelStr = levels[levelIdx];
      const parsed = parseLevelString(levelStr);

      if (!parsed) {
        console.warn(`Skipping invalid level string at row ${rowIdx}, level ${levelIdx}: ${levelStr}`);
        continue;
      }

      // Construct unique path up to this level
      const pathKey = levels.slice(0, levelIdx + 1).join('|');

      // Skip if we already created this node
      if (nodeMap.has(pathKey)) {
        parentPath = pathKey;
        continue;
      }

      // Determine if this is the leaf node (final level in this row)
      const isLeaf = levelIdx === levels.length - 1;

      // Create node
      const node: OrgChartNode = {
        id: pathKey,
        parentId: levelIdx === 0 ? null : parentPath,
        // Leaf nodes get the BEBL full name, intermediate nodes get business unit name
        name: isLeaf ? sigmaData[config.beblFullName][rowIdx] : parsed.name,
        businessUnit: parsed.name,
        beblCode: parsed.beblCode,
        businessUnitCode: parsed.businessUnitCode,
      };

      nodes.push(node);
      nodeMap.set(pathKey, node);
      parentPath = pathKey;
    }
  }

  // Calculate subordinate counts for each node
  calculateSubordinateCounts(nodes);

  return nodes;
}

/**
 * Calculates direct and total subordinate counts for each node
 * This is used by d3-org-chart for expand/collapse buttons
 * 
 * @param nodes - Array of org chart nodes
 */
function calculateSubordinateCounts(nodes: OrgChartNode[]): void {
  // Build children map
  const childrenMap = new Map<string, string[]>();
  
  for (const node of nodes) {
    if (node.parentId) {
      if (!childrenMap.has(node.parentId)) {
        childrenMap.set(node.parentId, []);
      }
      childrenMap.get(node.parentId)!.push(node.id);
    }
  }

  // Calculate counts
  for (const node of nodes) {
    const children = childrenMap.get(node.id) || [];
    node._directSubordinates = children.length;
    node._totalSubordinates = calculateTotalSubordinates(node.id, childrenMap);
  }
}

/**
 * Recursively calculates total subordinates for a node
 * 
 * @param nodeId - Node ID to calculate for
 * @param childrenMap - Map of parent IDs to child IDs
 * @returns Total count of all descendants
 */
function calculateTotalSubordinates(
  nodeId: string,
  childrenMap: Map<string, string[]>
): number {
  const children = childrenMap.get(nodeId) || [];
  let count = children.length;

  for (const childId of children) {
    count += calculateTotalSubordinates(childId, childrenMap);
  }

  return count;
}

/**
 * Searches nodes by name or BEBL code (case-insensitive, partial match)
 * 
 * @param nodes - Array of org chart nodes
 * @param searchTerm - Search query
 * @returns Array of matching nodes
 */
export function searchNodes(nodes: OrgChartNode[], searchTerm: string): OrgChartNode[] {
  if (!searchTerm || searchTerm.trim() === '') {
    return [];
  }

  const term = searchTerm.toLowerCase().trim();

  return nodes.filter(node => {
    const nameMatch = node.name.toLowerCase().includes(term);
    const beblCodeMatch = node.beblCode?.toLowerCase().includes(term);
    const businessUnitMatch = node.businessUnit.toLowerCase().includes(term);
    
    return nameMatch || beblCodeMatch || businessUnitMatch;
  });
}

