# Red-Black Tree Visualizer

An interactive web application built with React, TypeScript, and Vite to visualize the operations of a Red-Black Tree.

## Binary Search Trees (BST)
A **Binary Search Tree** is a rooted binary tree data structure with the following properties:
- The left subtree of a node contains only nodes with keys lesser than the node's key.
- The right subtree of a node contains only nodes with keys greater than the node's key.
- The left and right subtrees each must also be a binary search tree.

Standard BSTs do not guarantee balance. In the worst case (e.g., inserting sorted data), they can become "skewed" like a linked list, leading to $O(n)$ time complexity.

## Red-Black Trees (RBT)
A **Red-Black Tree** is a self-balancing version of a BST. By enforcing strict coloring rules and using rotations during insertions and deletions, it ensures the tree height remains logarithmic ($O(\lg n)$), providing guaranteed performance even in the worst-case scenarios.

### Time Complexity Comparison
| Operation | BST (Average) | BST (Worst) | RBT (Worst Case) |
| :--- | :--- | :--- | :--- |
| **Search** | $O(\lg n)$ | $O(n)$ | $O(\lg n)$ |
| **Insert** | $O(\lg n)$ | $O(n)$ | $O(\lg n)$ |
| **Delete** | $O(\lg n)$ | $O(n)$ | $O(\lg n)$ |

### Why Red-Black Trees?
While AVL trees are more strictly balanced (providing faster lookups), Red-Black Trees are often preferred in production systems because they require fewer rotations on average during insertions and deletions. They are the underlying data structure for:
- **Java**: `java.util.TreeMap` and `java.util.TreeSet`.
- **C++ STL**: `std::map`, `std::multimap`, `std::set`.
- **Linux Kernel**: Completely Fair Scheduler (CFS) and virtual memory tracking.

### The Five Properties of Red-Black Trees:
1.  **Every node** is either Red or Black.
2.  **The root** is always Black.
3.  **Every leaf (NIL)** is Black. (This implementation uses a shared `nil` sentinel node).
4.  **If a node is Red**, then both its children are Black (no two consecutive Reds).
5.  **Black-Height Consistency**: For each node, all simple paths from the node down to its descendant leaves must contain the exact same number of Black nodes.

## Implementation Details
This visualizer animates the structural changes and recoloring required to maintain RBT properties after insertion and deletion.

### Insertion Fixups
- **Case 1**: Uncle is Red. (Recoloring)
- **Case 2**: Uncle is Black, node is a right child. (Left rotation)
- **Case 3**: Uncle is Black, node is a left child. (Right rotation)

### Deletion Fixups
- **Case 1**: Sibling is Red.
- **Case 2**: Sibling is Black, and both of the sibling's children are Black.
- **Case 3**: Sibling is Black, sibling's left child is Red, and sibling's right child is Black.
- **Case 4**: Sibling is Black, and sibling's right child is Red.

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```
