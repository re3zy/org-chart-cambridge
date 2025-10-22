# Org Chart Plugin for Sigma Computing

A powerful organizational chart visualization plugin for Sigma Computing that displays business unit hierarchies where employees (BEBLs) can appear in multiple business units as separate nodes.

## Features

- **Hierarchical Visualization**: Display up to 11 levels of organizational hierarchy (Level 0-10)
- **Multiple Appearances**: Same BEBL can appear in multiple business units as separate nodes
- **Interactive Navigation**: Expand/collapse nodes, zoom, and pan
- **Search & Filter**: Search by employee name, BEBL code, or business unit name
- **Clean Design**: Simplified card design showing name and business unit
- **Responsive**: Adapts to container size

## Tech Stack

- **React + TypeScript**: Type-safe component development
- **Vite**: Fast build tool and development server
- **d3-org-chart**: Professional org chart visualization library
- **Tailwind CSS**: Modern utility-first styling
- **@sigmacomputing/plugin**: Sigma Computing plugin SDK

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server on port 5174:

```bash
npm run dev
```

The plugin will be available at `http://localhost:5174`

### Build

Build for production:

```bash
npm run build
```

## Data Structure

### Input Data Requirements

The plugin expects hierarchical data with the following columns:

#### Required Columns
- **Level 0**: Root level (usually "Cambridge Investment Research, Inc. (00001)-QV6")
- **Bebl Full Name**: Employee name (e.g., "Stephen W Gierl")
- **Business Unit Id**: Unique identifier for each row
- **Business Unit Name**: Name of the business unit

#### Optional Columns
- **Level 1-10**: Additional hierarchy levels
- **Search Enabled**: Variable to control search visibility

### Level Column Format

Each level column should contain strings in the format:
```
"Name (BU_Code)-BEBL_Code"
```

Example:
```
"Cambridge Investment Research, Inc. (00001)-QV6"
"Gierl Augustine & Associates, LLC (01070)-AR7"
```

### Sample Data

```
Business Unit Id: cd567dc6-feed-429b-853b-a17500fb9b3e
Business Unit Name: Gierl Augustine & Associates, LLC
Bebl Full Name: Stephen W Gierl
Level 0: "Cambridge Investment Research, Inc. (00001)-QV6"
Level 1: "Gierl Augustine & Associates, LLC (01070)-AR7"
Level 2-10: null
```

## Configuration in Sigma

### Plugin Configuration Panel

1. **Data Source**: Select your element containing the hierarchy data
2. **Column Mappings**:
   - Map "Bebl Full Name" column
   - Map "Business Unit Id" column
   - Map "Business Unit Name" column
   - Map "Level 0" column (required)
   - Map additional Level 1-10 columns as needed
3. **Variables** (optional):
   - Set "searchEnabled" variable to control search visibility

### Example Configuration

```typescript
// The plugin automatically configures these fields:
- source: Your data element
- beblFullName: Employee name column
- businessUnitId: Unique ID column
- businessUnitName: Business unit name column
- level0 through level10: Hierarchy path columns
```

## Architecture

### Project Structure

```
src/
├── components/
│   ├── OrgChartComponent.tsx    # d3-org-chart wrapper
│   └── SearchFilter.tsx          # Search functionality
├── utils/
│   └── dataTransform.ts          # Data transformation logic
├── types/
│   └── index.ts                  # TypeScript interfaces
├── App.tsx                       # Main plugin component
├── App.css                       # Global styles
└── main.tsx                      # Entry point
```

### Key Components

#### App.tsx
- Main plugin component
- Configures Sigma editor panel
- Manages data transformation
- Handles search state

#### OrgChartComponent.tsx
- Wraps d3-org-chart library
- Renders interactive org chart
- Handles node styling and interactions
- Supports search highlighting

#### SearchFilter.tsx
- Provides search/filter UI
- Autocomplete dropdown
- Keyboard navigation
- Case-insensitive partial matching

#### dataTransform.ts
- Parses level strings
- Builds parent-child relationships
- Calculates subordinate counts
- Search functionality

## How It Works

### Data Transformation Flow

1. **Input**: Receive columnar data from Sigma with Level 0-10 columns
2. **Parse**: Extract name, BU code, and BEBL code from each level string
3. **Build**: Construct unique nodes for each hierarchy path
4. **Link**: Establish parent-child relationships based on level sequence
5. **Output**: Generate d3-org-chart compatible node array

### Critical Features

- **Parent-Child Relationships**: Built dynamically from level sequence
- **Unique Paths**: Each unique hierarchy path creates a separate node
- **Root Handling**: Level 0 (Cambridge) has `parentId: null`
- **Multiple Appearances**: Same BEBL in different branches = separate nodes

## Development Notes

### Best Practices

- **DRY Principle**: Reusable utility functions in `dataTransform.ts`
- **Type Safety**: Comprehensive TypeScript interfaces
- **Comments**: Well-documented code throughout
- **Performance**: `useMemo` for expensive computations
- **Error Handling**: Graceful handling of invalid data

### Common Issues

1. **No data displayed**: Ensure Level 0 is mapped and contains valid data
2. **Broken hierarchy**: Check level string format matches "Name (Code)-BEBL"
3. **Search not working**: Verify searchEnabled variable is set to true

## Port Configuration

The plugin runs on **port 5174** to avoid conflicts with other projects.

To change the port, edit `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 5174, // Change this
  },
});
```

## License

Private - For internal use only

## Support

For questions or issues, contact the development team.

