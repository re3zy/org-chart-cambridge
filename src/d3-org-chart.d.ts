/**
 * Type definitions for d3-org-chart
 * @see https://github.com/bumbeishvili/org-chart
 */

declare module 'd3-org-chart' {
  export interface OrgChartNode {
    id: string;
    parentId: string | null;
    [key: string]: any;
  }

  export class OrgChart<T = any> {
    constructor();
    
    container(selector: string | HTMLElement): this;
    data(data: T[]): this;
    nodeWidth(accessor: (node: any) => number): this;
    nodeHeight(accessor: (node: any) => number): this;
    childrenMargin(accessor: (node: any) => number): this;
    compactMarginBetween(accessor: (node: any) => number): this;
    compactMarginPair(accessor: (node: any) => number): this;
    neighbourMargin(accessor: (node: any) => number): this;
    buttonContent(accessor: (options: { node: any; state: any }) => string): this;
    nodeContent(accessor: (node: any) => string): this;
    onNodeClick(handler: (nodeId: string) => void): this;
    setCentered(nodeId: string): this;
    render(): this;
    
    [key: string]: any;
  }
}

