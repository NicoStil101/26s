import React from 'react';
import { RedBlackNode, Color } from '../lib/RedBlackTree';

interface TreeViewProps {
  root: RedBlackNode;
  nil: RedBlackNode;
  focusNodeId?: string;
}

interface PositionedNode {
  node: RedBlackNode;
  x: number;
  y: number;
}

const NODE_RADIUS = 20;
const LEVEL_HEIGHT = 80;
const MIN_HORIZONTAL_SPACING = 40;

const TreeView: React.FC<TreeViewProps> = ({ root, nil, focusNodeId }) => {
  const positions: Map<string, PositionedNode> = new Map();

  // Improved layout: assign x-coordinates based on in-order traversal
  let currentX = 0;
  const inOrderLayout = (node: RedBlackNode, depth: number) => {
    if (node === nil) {
      const x = currentX;
      currentX += MIN_HORIZONTAL_SPACING;
      const id = `nil-${x}-${depth}`;
      positions.set(id, { node, x, y: depth * LEVEL_HEIGHT + 40 });
      return;
    }

    inOrderLayout(node.left, depth + 1);
    
    const x = currentX;
    positions.set(node.id, { node, x, y: depth * LEVEL_HEIGHT + 40 });
    currentX += MIN_HORIZONTAL_SPACING;

    inOrderLayout(node.right, depth + 1);
  };

  inOrderLayout(root, 0);

  // The in-order layout already populated `positions` with correct x and y.
  // We just need to render them and their connections.
  const nodes: any[] = [];
  const edges: any[] = [];

  positions.forEach((pos, id) => {
    const { node, x, y } = pos;
    if (node !== nil) {
        // Draw edges to children
        if (node.left) {
            // Find left child position
            let leftPos: PositionedNode | undefined;
            if (node.left === nil) {
                // Find nil node that is to the left and down
                positions.forEach((p) => {
                    if (p.node === nil && p.y === y + LEVEL_HEIGHT && p.x < x) {
                        if (!leftPos || p.x > leftPos.x) leftPos = p;
                    }
                });
            } else {
                leftPos = positions.get(node.left.id);
            }
            if (leftPos) {
                edges.push(<line key={`e-l-${id}`} x1={x} y1={y} x2={leftPos.x} y2={leftPos.y} stroke="#999" strokeWidth={2} />);
            }
        }
        if (node.right) {
            let rightPos: PositionedNode | undefined;
            if (node.right === nil) {
                positions.forEach((p) => {
                    if (p.node === nil && p.y === y + LEVEL_HEIGHT && p.x > x) {
                        if (!rightPos || p.x < rightPos.x) rightPos = p;
                    }
                });
            } else {
                rightPos = positions.get(node.right.id);
            }
            if (rightPos) {
                edges.push(<line key={`e-r-${id}`} x1={x} y1={y} x2={rightPos.x} y2={rightPos.y} stroke="#999" strokeWidth={2} />);
            }
        }

        const color = node.color === Color.RED ? '#ff4d4d' : '#333';
        const stroke = node.id === focusNodeId ? '#00ff00' : '#fff';
        const strokeWidth = node.id === focusNodeId ? 4 : 2;
        nodes.push(
            <g key={id}>
                <circle cx={x} cy={y} r={NODE_RADIUS} fill={color} stroke={stroke} strokeWidth={strokeWidth} />
                <text x={x} y={y + 5} textAnchor="middle" fill="white" fontWeight="bold" pointerEvents="none">{node.key}</text>
            </g>
        );
    } else {
        nodes.push(
            <g key={id}>
                <rect x={x - 15} y={y - 10} width={30} height={20} fill="black" stroke="white" />
                <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="10px" pointerEvents="none">nil</text>
            </g>
        );
    }
  });

  const width = currentX + MIN_HORIZONTAL_SPACING;
  const height = Math.max(...Array.from(positions.values()).map(p => p.y)) + LEVEL_HEIGHT;

  return (
    <div style={{ overflow: 'auto', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9', padding: '16px', height: '500px' }}>
      <svg width={Math.max(width, 800)} height={Math.max(height, 400)}>
        {edges}
        {nodes}
      </svg>
    </div>
  );
};

export default TreeView;
