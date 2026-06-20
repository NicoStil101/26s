import matplotlib.pyplot as plt
import networkx as nx

# Constants
NIL = None

class Node:
    def __init__(self, key):
        self.key = key
        self.left = NIL
        self.right = NIL
        self.parent = NIL

def insert(root, key):
    """Inserts a key into the BST and maintains parent pointers."""
    z = Node(key)
    y = NIL
    x = root
    while x != NIL:
        y = x
        if z.key < x.key:
            x = x.left
        else:
            x = x.right
    z.parent = y
    if y == NIL:
        return z
    elif z.key < y.key:
        y.left = z
    else:
        y.right = z
    return root

def find_node(node, key):
    """Finds a node with the given key."""
    if node == NIL or key == node.key:
        return node
    if key < node.key:
        return find_node(node.left, key)
    return find_node(node.right, key)

# --- ALGORITHM START ---

def BSTMin(x, path=None):
    """Helper function to find the minimum in a subtree (leftmost node)."""
    if path is not None and x.key not in path:
        path.append(x.key)
    while x.left != NIL:
        x = x.left
        if path is not None:
            path.append(x.key)
    return x

def BSTSuccessor(x):
    """Main successor function as per the provided pseudocode."""
    path = [x.key]
    
    # Case 1: If the right subtree of x is nonempty
    if x.right != NIL:
        # Successor is the leftmost node in x's right subtree
        res = BSTMin(x.right, path)
        return res, path, "Case 1: Right subtree exists. Finding min in right subtree."
    
    # Case 2: If the right subtree of x is empty
    y = x.parent
    if y != NIL:
        path.append(y.key)
        
    while y != NIL and x == y.right:
        x = y
        y = y.parent
        if y != NIL and y.key not in path:
            path.append(y.key)
             
    return y, path, "Case 2: No right subtree. Moving up to first ancestor where node is in left subtree."

# --- ALGORITHM END ---

def get_tree_edges(node, edges=None):
    """Traverses tree to get all edges for NetworkX."""
    if edges is None:
        edges = []
    if node != NIL:
        if node.left != NIL:
            edges.append((node.key, node.left.key))
            get_tree_edges(node.left, edges)
        if node.right != NIL:
            edges.append((node.key, node.right.key))
            get_tree_edges(node.right, edges)
    return edges

def hierarchy_pos(G, root=None, width=1., vert_gap = 0.2, vert_loc = 0, xcenter = 0.5):
    """
    If the graph is a tree this will return the positions for every node in 
    a hierarchical layout.
    """
    if not nx.is_tree(G):
        raise TypeError('cannot use hierarchy_pos on a graph that is not a tree')

    if root is None:
        if isinstance(G, nx.DiGraph):
            root = next(iter(nx.topological_sort(G)))  # Allows back compatibility with earlier versions
        else:
            root = next(iter(G.nodes))

    def _hierarchy_pos(G, root, width=1., vert_gap = 0.2, vert_loc = 0, xcenter = 0.5, pos = None, parent = None):
        if pos is None:
            pos = {root: (xcenter, vert_loc)}
        else:
            pos[root] = (xcenter, vert_loc)
        neighbors = list(G.neighbors(root))
        if parent is not None:
            neighbors.remove(parent)
        if len(neighbors) != 0:
            dx = width / len(neighbors) 
            nextx = xcenter - width/2 - dx/2
            for neighbor in neighbors:
                nextx += dx
                pos = _hierarchy_pos(G,neighbor, width=dx, vert_gap=vert_gap, 
                                    vert_loc=vert_loc-vert_gap, xcenter=nextx, pos=pos, parent=root)
        return pos

    return _hierarchy_pos(G, root, width, vert_gap, vert_loc, xcenter)

def visualize_successor(root, start_key, filename, title_prefix):
    """Generates a visualization of the successor search."""
    node = find_node(root, start_key)
    if not node:
        print(f"Node {start_key} not found.")
        return
        
    successor, path, description = BSTSuccessor(node)
    
    G = nx.Graph()
    edges = get_tree_edges(root)
    G.add_edges_from(edges)
    
    # Hierarchical layout
    pos = hierarchy_pos(G, root.key)
    
    plt.figure(figsize=(12, 8))
    
    # Determine node colors
    node_colors = []
    for n in G.nodes():
        if n == start_key:
            node_colors.append('#ffaa00') # Start node (Orange)
        elif successor and n == successor.key:
            node_colors.append('#00aa00') # Successor (Green)
        elif n in path:
            node_colors.append('#ffff00') # Path (Yellow)
        else:
            node_colors.append('#aaddff') # Default (Light Blue)
            
    nx.draw(G, pos, with_labels=True, node_color=node_colors, node_size=2000, 
            font_size=14, font_weight='bold', edge_color='#cccccc')
    
    # Highlight path edges in red
    path_edges = []
    # Note: path is a sequence of node keys. We need to check if an edge exists in the graph.
    for i in range(len(path) - 1):
        u, v = path[i], path[i+1]
        if G.has_edge(u, v):
            path_edges.append((u, v))
    
    nx.draw_networkx_edges(G, pos, edgelist=path_edges, edge_color='red', width=4)
    
    res_key = successor.key if successor else "NIL"
    plt.title(f"{title_prefix}\nFinding Successor of Node {start_key} -> Result: {res_key}\n{description}", 
              fontsize=14, pad=20)
    
    # Add a legend
    from matplotlib.lines import Line2D
    legend_elements = [
        plt.Line2D([0], [0], marker='o', color='w', label='Start Node', markerfacecolor='#ffaa00', markersize=15),
        plt.Line2D([0], [0], marker='o', color='w', label='Successor Node', markerfacecolor='#00aa00', markersize=15),
        plt.Line2D([0], [0], marker='o', color='w', label='Traversed Path', markerfacecolor='#ffff00', markersize=15),
        plt.Line2D([0], [0], color='red', lw=4, label='Traversal Step')
    ]
    plt.legend(handles=legend_elements, loc='upper right')
    
    plt.savefig(filename)
    print(f"Visualization saved to {filename}")
    plt.close()

def main():
    # Construct exact tree from lecture:
    # Root: 15
    # Level 1: 6 (left), 18 (right)
    # Level 2: 3 (left of 6), 7 (right of 6) | 17 (left of 18), 20 (right of 18)
    # Level 3: 2 (left of 3), 4 (right of 3) | 13 (right of 7)
    # Level 4: 9 (left of 13)
    
    # Insertion order to guarantee this structure:
    keys = [15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9]
    root = NIL
    for k in keys:
        root = insert(root, k)
        
    print("BST constructed with keys:", keys)
    
    # Scenario A: Find the successor of node 6
    # Trigger Case 1: Right subtree exists (7 -> 13 -> 9)
    # Successor should be 7 (leftmost node in right subtree)
    visualize_successor(root,18 , "scenario_a.png", "Scenario A: Right Subtree Non-empty")
    
    # Scenario B: Find the successor of node 13
    # Trigger Case 2: Right subtree is empty. 
    # Path: 13 (right of 7) -> 7 (right of 6) -> 6 (left of 15) -> 15 (Stop)
    # Successor should be 15
    visualize_successor(root, 13, "scenario_b.png", "Scenario B: Right Subtree Empty")

if __name__ == "__main__":
    main()
