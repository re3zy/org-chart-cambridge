# Development Guide

## Architecture Overview

### Data Flow

```
Sigma Data (Columnar)
    ↓
buildOrgChartData() → Parse levels → Build nodes → Establish relationships
    ↓
OrgChartNode[] (d3-org-chart format)
    ↓
OrgChartComponent → Render visualization
    ↓
Interactive Org Chart
```

### Key Files

#### 1. `src/types/index.ts`
Type definitions for:
- `OrgChartNode`: d3-org-chart compatible node structure
- `ParsedLevelInfo`: Parsed level string components
- `PluginConfig`: Sigma configuration mapping
- `SigmaData`: Columnar data structure

#### 2. `src/utils/dataTransform.ts`
Core transformation logic:

**`parseLevelString()`**
- Input: `"Cambridge Investment Research, Inc. (00001)-QV6"`
- Output: `{ name, businessUnitCode, beblCode, raw }`
- Regex pattern: `/^(.+?)\s*\(([^)]+)\)-([^-]+)$/`

**`buildOrgChartData()`**
- Iterates through Sigma data rows
- Collects level columns (stops at first null)
- Creates unique path for each node
- Assigns parent IDs based on level sequence
- Handles root node (Level 0) with `parentId: null`
- Calculates subordinate counts

**`searchNodes()`**
- Case-insensitive partial matching
- Searches: name, BEBL code, business unit

#### 3. `src/components/OrgChartComponent.tsx`
d3-org-chart wrapper:
- Initializes OrgChart instance
- Customizes node appearance (card design)
- Handles expand/collapse buttons
- Manages search highlighting
- Provides centering on search results

#### 4. `src/components/SearchFilter.tsx`
Search UI component:
- Autocomplete dropdown
- Keyboard navigation (↑↓ Enter Esc)
- Click outside to close
- Clear button

#### 5. `src/App.tsx`
Main plugin component:
- Configures Sigma editor panel
- Manages data transformation with `useMemo`
- Handles search state
- Renders layout with header and chart

## Data Transformation Deep Dive

### Example Transformation

**Input Row:**
```javascript
{
  beblFullName: "Stephen W Gierl",
  businessUnitId: "cd567dc6-feed-429b-853b-a17500fb9b3e",
  businessUnitName: "Gierl Augustine & Associates, LLC",
  level0: "Cambridge Investment Research, Inc. (00001)-QV6",
  level1: "Gierl Augustine & Associates, LLC (01070)-AR7",
  level2: null,
  // ... level3-10: null
}
```

**Processing Steps:**

1. **Collect levels**: `[level0, level1]` (stop at null)

2. **Parse each level**:
   - Level 0: `{ name: "Cambridge Investment Research, Inc.", businessUnitCode: "00001", beblCode: "QV6" }`
   - Level 1: `{ name: "Gierl Augustine & Associates, LLC", businessUnitCode: "01070", beblCode: "AR7" }`

3. **Build nodes**:
   ```javascript
   // Node 1 (Root)
   {
     id: "Cambridge Investment Research, Inc. (00001)-QV6",
     parentId: null,
     name: "Cambridge Investment Research, Inc.",
     businessUnit: "Cambridge Investment Research, Inc.",
     beblCode: "QV6",
     businessUnitCode: "00001"
   }
   
   // Node 2 (Leaf)
   {
     id: "Cambridge Investment Research, Inc. (00001)-QV6|Gierl Augustine & Associates, LLC (01070)-AR7",
     parentId: "Cambridge Investment Research, Inc. (00001)-QV6",
     name: "Stephen W Gierl",  // Leaf gets BEBL name
     businessUnit: "Gierl Augustine & Associates, LLC",
     beblCode: "AR7",
     businessUnitCode: "01070"
   }
   ```

4. **Path-based IDs**: Use `|` separator to create unique paths
   - Ensures same BEBL in different branches = different nodes
   - Prevents unintended merging

5. **Calculate subordinates**:
   - Build children map
   - Recursively count descendants
   - Set `_directSubordinates` and `_totalSubordinates`

### Critical Design Decisions

#### Why Path-Based IDs?

Using the full path as the node ID ensures:
- Same BEBL in multiple branches creates separate nodes
- No accidental merging of different hierarchy positions
- Each unique path = unique visual node

#### Why Leaf Nodes Get BEBL Name?

```typescript
name: isLeaf ? sigmaData[config.beblFullName][rowIdx] : parsed.name
```

- **Leaf nodes** (final level): Show actual employee name
- **Intermediate nodes** (Level 0-9): Show business unit name
- Provides clear visual distinction

#### Why Stop at First Null?

```typescript
if (value) {
  levels.push(value);
} else {
  break; // Stop at first null
}
```

- Prevents gaps in hierarchy
- Ensures valid parent-child relationships
- Matches business logic (nulls indicate end of path)

## Extending the Plugin

### Add New Search Filter

Edit `src/utils/dataTransform.ts`:

```typescript
export function searchNodes(nodes: OrgChartNode[], searchTerm: string): OrgChartNode[] {
  // Add new search criteria
  const businessUnitCodeMatch = node.businessUnitCode?.toLowerCase().includes(term);
  return nameMatch || beblCodeMatch || businessUnitCodeMatch;
}
```

### Customize Card Design

Edit `src/components/OrgChartComponent.tsx`:

```typescript
.nodeContent((d) => {
  // Modify HTML structure
  return `
    <div style="...">
      <!-- Add new fields -->
      <div>${node.customField}</div>
    </div>
  `;
})
```

### Add Column to Data

1. Update types in `src/types/index.ts`:
```typescript
export interface OrgChartNode {
  // ... existing fields
  customField?: string;
}
```

2. Update config in `src/App.tsx`:
```typescript
client.config.configureEditorPanel([
  // ... existing
  { name: 'customField', type: 'column', source: 'source', allowMultiple: false },
]);
```

3. Update transformation in `src/utils/dataTransform.ts`:
```typescript
const node: OrgChartNode = {
  // ... existing fields
  customField: sigmaData[config.customField]?.[rowIdx],
};
```

### Add Interactions

#### Example: Click to Filter

```typescript
// In App.tsx
const handleNodeClick = useCallback((node: OrgChartNode) => {
  // Set Sigma control variable
  client.config.setVariable('selectedBEBL', node.beblCode);
}, []);
```

### Performance Optimization

#### Memoization

Already implemented:
```typescript
const orgChartData = useMemo(() => {
  return buildOrgChartData(sigmaData, config);
}, [sigmaData, config]);
```

#### Debounce Search

Add to `SearchFilter.tsx`:
```typescript
const [debouncedTerm, setDebouncedTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedTerm(searchTerm);
  }, 300);
  return () => clearTimeout(timer);
}, [searchTerm]);
```

## Testing Strategy

### Unit Tests

Test data transformation:
```typescript
describe('parseLevelString', () => {
  it('should parse valid level string', () => {
    const result = parseLevelString('Cambridge (00001)-QV6');
    expect(result).toEqual({
      name: 'Cambridge',
      businessUnitCode: '00001',
      beblCode: 'QV6',
      raw: 'Cambridge (00001)-QV6'
    });
  });
});
```

### Integration Tests

Test with sample Sigma data:
```typescript
describe('buildOrgChartData', () => {
  it('should create hierarchy from levels', () => {
    const mockData = { /* ... */ };
    const nodes = buildOrgChartData(mockData, config);
    expect(nodes[0].parentId).toBeNull(); // Root
    expect(nodes[1].parentId).toBe(nodes[0].id); // Child
  });
});
```

## Common Issues & Solutions

### Issue: Nodes not appearing

**Cause**: Invalid level string format
**Solution**: Validate format matches `"Name (Code)-BEBL"`

### Issue: Wrong hierarchy relationships

**Cause**: Level columns not sequential
**Solution**: Ensure no gaps in level mapping (if Level 2 exists, Level 1 must exist)

### Issue: Same BEBL merging incorrectly

**Cause**: Not using path-based IDs
**Solution**: Already handled by using full path as node ID

### Issue: Search not highlighting

**Cause**: Node ID mismatch
**Solution**: Ensure search returns matching node IDs exactly

## Best Practices

### 1. Type Safety
Always define types for new data structures:
```typescript
interface NewFeature {
  field: string;
}
```

### 2. Comments
Document complex logic:
```typescript
// Parse level string in format "Name (BU_Code)-BEBL_Code"
// Example: "Cambridge (00001)-QV6"
```

### 3. Error Handling
Gracefully handle invalid data:
```typescript
if (!parsed) {
  console.warn(`Invalid level string: ${levelStr}`);
  continue;
}
```

### 4. Performance
Use memoization for expensive operations:
```typescript
const result = useMemo(() => expensiveCalculation(), [deps]);
```

### 5. Reusability
Extract common logic to utilities:
```typescript
// utils/helpers.ts
export function formatName(name: string): string { /* ... */ }
```

## Deployment

### Development
```bash
npm run dev  # Port 5174
```

### Production Build
```bash
npm run build
```

### Hosting Options
1. **Local Development**: Use `npm run dev` with ngrok for external access
2. **Static Hosting**: Deploy `dist/` folder to Netlify, Vercel, etc.
3. **Corporate Server**: Deploy to internal web server

## Debug Tips

### Enable Console Logging

Add to `src/utils/dataTransform.ts`:
```typescript
console.log('Transforming data:', { sigmaData, config });
console.log('Generated nodes:', nodes);
```

### Inspect Sigma Data

In `App.tsx`:
```typescript
useEffect(() => {
  console.log('Raw Sigma data:', sigmaData);
  console.log('Config:', config);
}, [sigmaData, config]);
```

### d3-org-chart Events

In `OrgChartComponent.tsx`:
```typescript
.onNodeClick((nodeId) => {
  console.log('Clicked node:', nodeId);
})
```

## Resources

- [d3-org-chart Documentation](https://github.com/bumbeishvili/org-chart)
- [Sigma Plugin SDK](https://help.sigmacomputing.com/docs/intro-to-custom-plugins)
- [React TypeScript Docs](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Support

For questions or issues:
1. Check this documentation
2. Review sample code in `src/samples/plugin_samples/`
3. Check console for error messages
4. Contact development team

Happy coding! 🚀

