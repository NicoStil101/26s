import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TreeVisualizer = ({ root, activeNode, successorNode, pathNodes, onNodeClick }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!root) return;

    // Convert our BST structure to D3 hierarchy with phantom nodes for alignment
    const buildHierarchy = (node) => {
      if (!node) return null;
      
      const children = [];
      // Always provide two slots if at least one child exists to maintain angles
      if (node.left || node.right) {
        children.push(node.left ? buildHierarchy(node.left) : { name: '__phantom_left__', phantom: true });
        children.push(node.right ? buildHierarchy(node.right) : { name: '__phantom_right__', phantom: true });
      }

      return {
        name: node.key,
        children: children.length > 0 ? children : null,
      };
    };

    const data = buildHierarchy(root);
    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const treeLayout = d3.tree().size([width - margin.left - margin.right, height - margin.top - margin.bottom]);
    const rootHierarchy = d3.hierarchy(data);
    treeLayout(rootHierarchy);

    // Filter out links to phantom nodes
    const links = rootHierarchy.links().filter(d => !d.target.data.phantom);

    // Links
    g.selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y))
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2);

    // Filter out phantom nodes for rendering
    const nodes = g.selectAll('.node')
      .data(rootHierarchy.descendants().filter(d => !d.data.phantom))
      .enter()
      .append('g')
      .attr('class', 'node cursor-pointer')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .on('click', (event, d) => {
        if (onNodeClick) onNodeClick(d.data.name, d.x, d.y);
      });

    nodes.append('circle')
      .attr('r', 20)
      .attr('fill', d => {
        if (successorNode && d.data.name === successorNode.key) return '#22c55e'; // Green
        if (activeNode && d.data.name === activeNode.key) return '#f59e0b'; // Orange
        if (pathNodes.includes(d.data.name)) return '#fbbf24'; // Yellow
        return '#fff';
      })
      .attr('stroke', d => {
        if (successorNode && d.data.name === successorNode.key) return '#166534';
        if (activeNode && d.data.name === activeNode.key) return '#b45309';
        if (pathNodes.includes(d.data.name)) return '#d97706';
        return '#3b82f6';
      })
      .attr('stroke-width', 3)
      .style('transition', 'fill 0.3s, stroke 0.3s');

    nodes.append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text(d => d.data.name)
      .attr('font-weight', 'bold')
      .attr('fill', '#1e293b');

  }, [root, activeNode, successorNode, pathNodes, onNodeClick]);

  return (
    <div className="flex justify-center bg-slate-50 rounded-xl shadow-inner p-4 overflow-auto">
      <svg ref={svgRef} width={800} height={500}></svg>
    </div>
  );
};

export default TreeVisualizer;
