# Quick Start Guide

## Start Development Server

```bash
npm run dev
```

The plugin will be available at: `http://localhost:5174`

## Configure in Sigma

1. **Add Custom Plugin** in Sigma workbook
2. **Enter Plugin URL**: `http://localhost:5174`
3. **Configure Data Source**:
   - Select your element with hierarchy data
   
4. **Map Columns**:
   - **Bebl Full Name** → Employee name column
   - **Business Unit Id** → Unique identifier column
   - **Business Unit Name** → Business unit name column
   - **Level 0** → Root level (e.g., "Cambridge Investment Research, Inc. (00001)-QV6")
   - **Level 1-10** → Additional hierarchy levels (optional, map as needed)

## Data Format

Each level column should contain strings like:
```
"Business Unit Name (BU_Code)-BEBL_Code"
```

Example:
```
Level 0: "Cambridge Investment Research, Inc. (00001)-QV6"
Level 1: "Gierl Augustine & Associates, LLC (01070)-AR7"
Level 2: "Gierl Augustine & Associates (01975)-AR7"
```

## Features

- ✅ Hierarchical org chart with up to 11 levels
- ✅ Search by name, BEBL code, or business unit
- ✅ Expand/collapse nodes
- ✅ Zoom and pan
- ✅ Same employee can appear in multiple branches
- ✅ Responsive design

## Troubleshooting

### No data displayed
- Ensure Level 0 column is mapped
- Check that Level 0 contains valid data
- Verify data format matches "Name (Code)-BEBL"

### Hierarchy looks wrong
- Verify level strings follow the format exactly
- Check that levels are sequential (no gaps)
- Ensure Business Unit Id is unique per row

### Search not working
- Check that searchEnabled variable is set to true (default)
- Verify there's actual data to search

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Project Structure

```
src/
├── App.tsx                      # Main plugin (Sigma config)
├── components/
│   ├── OrgChartComponent.tsx    # d3-org-chart wrapper
│   └── SearchFilter.tsx         # Search UI
├── utils/
│   └── dataTransform.ts         # Data transformation
└── types/
    └── index.ts                 # TypeScript types
```

## Key Implementation Details

### Data Transformation
- Level strings are parsed to extract: name, BU code, BEBL code
- Parent-child relationships built from level sequence
- Unique path for each hierarchy creates separate nodes
- Root node (Level 0) has `parentId: null`

### Multiple Appearances
Same BEBL in different branches creates **separate nodes** - this is intentional!

### Node Display
- **Name**: Shows BEBL full name for leaf nodes
- **Business Unit**: Shows business unit name
- **BEBL Code**: Shown in smaller text

## Next Steps

1. Test with your Sigma data
2. Adjust styling in `App.css` if needed
3. Customize card design in `OrgChartComponent.tsx`
4. Add additional features as needed

Enjoy your org chart visualization! 🎉

