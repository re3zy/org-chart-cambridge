/**
 * OrgChartComponent - Wrapper for d3-org-chart library
 * Renders the organizational hierarchy visualization
 */

import { useEffect, useRef, useCallback } from 'react';
import { OrgChart } from 'd3-org-chart';
import * as d3 from 'd3';
import { OrgChartNode } from '../types';

interface OrgChartComponentProps {
  data: OrgChartNode[];
  searchNodeId?: string | null;
  onNodeClick?: (node: OrgChartNode) => void;
}

/**
 * Component that renders the d3-org-chart visualization
 * 
 * Features:
 * - Expandable/collapsible nodes
 * - Zoom and pan
 * - Search highlighting
 * - Simplified card design (name + business unit)
 */
export default function OrgChartComponent({
  data,
  searchNodeId,
  onNodeClick,
}: OrgChartComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<OrgChart<OrgChartNode> | null>(null);

  /**
   * Initialize and render the org chart
   */
  const renderChart = useCallback(() => {
    if (!containerRef.current || data.length === 0) {
      return;
    }

    // Clear existing chart
    d3.select(containerRef.current).selectAll('*').remove();

    // Initialize org chart
    const chart = new OrgChart<OrgChartNode>()
      .container(containerRef.current)
      .data(data)
      .nodeWidth(() => 240)
      .nodeHeight(() => 100)
      .childrenMargin(() => 50)
      .compactMarginBetween(() => 35)
      .compactMarginPair(() => 30)
      .neighbourMargin(() => 20)
      .buttonContent(({ node }: { node: any; state: any }) => {
        const subordinates = node.data._directSubordinates || 0;
        return `
          <div style="border-radius:3px;padding:4px 8px;font-size:12px;margin:auto;background-color:#e5e7eb;color:#374151;font-weight:500;">
            <span style="font-size:10px">
              ${node.children ? '▲' : '▼'}
            </span>
            ${subordinates}
          </div>
        `;
      })
      .nodeContent((d: any) => {
        const node = d.data;
        const isHighlighted = searchNodeId && d.id === searchNodeId;
        const backgroundColor = isHighlighted ? '#FEF3C7' : '#FFFFFF';
        const borderColor = isHighlighted ? '#F59E0B' : '#E5E7EB';
        const borderWidth = isHighlighted ? '2px' : '1px';

        return `
          <div style="
            width: ${d.width}px;
            height: ${d.height}px;
            background-color: ${backgroundColor};
            border: ${borderWidth} solid ${borderColor};
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          ">
            <div style="
              font-size: 16px;
              font-weight: 600;
              color: #111827;
              margin-bottom: 8px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 100%;
            ">
              ${node.name}
            </div>
            <div style="
              font-size: 13px;
              color: #6B7280;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              width: 100%;
            ">
              ${node.businessUnit}
            </div>
            ${node.beblCode ? `
              <div style="
                font-size: 11px;
                color: #9CA3AF;
                margin-top: 4px;
              ">
                ${node.beblCode}
              </div>
            ` : ''}
          </div>
        `;
      })
      .onNodeClick((nodeId: string) => {
        if (onNodeClick) {
          const node = data.find(n => n.id === nodeId);
          if (node) {
            onNodeClick(node);
          }
        }
      })
      .render();

    chartRef.current = chart;
  }, [data, searchNodeId, onNodeClick]);

  /**
   * Re-render chart when data or search changes
   */
  useEffect(() => {
    renderChart();

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        d3.select(containerRef.current).selectAll('*').remove();
      }
    };
  }, [renderChart]);

  /**
   * Center on searched node
   */
  useEffect(() => {
    if (searchNodeId && chartRef.current) {
      // Find the node and center on it
      const node = data.find(n => n.id === searchNodeId);
      if (node) {
        chartRef.current.setCentered(searchNodeId).render();
      }
    }
  }, [searchNodeId, data]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}

