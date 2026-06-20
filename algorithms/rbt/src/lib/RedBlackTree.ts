export const Color = {
  RED: 0,
  BLACK: 1,
} as const;

export type ColorType = typeof Color[keyof typeof Color];

export class RedBlackNode {
  key: number;
  color: ColorType;
  left: RedBlackNode;
  right: RedBlackNode;
  parent: RedBlackNode;
  id: string; // For React keys and animation tracking

  constructor(key: number, color: ColorType, id: string) {
    this.key = key;
    this.color = color;
    this.id = id;
    // These will be set to nil after construction in the tree
    this.left = null!;
    this.right = null!;
    this.parent = null!;
  }

  // Helper to clone a node (for snapshots)
  clone(): RedBlackNode {
    const newNode = new RedBlackNode(this.key, this.color, this.id);
    return newNode;
  }
}

export interface AnimationStep {
  root: RedBlackNode;
  message: string;
  focusNodeId?: string;
  type: 'RECOLOR' | 'ROTATE' | 'BST_INSERT' | 'BST_DELETE' | 'CASE_EXPLANATION' | 'FINAL';
}

export class RedBlackTree {
  root: RedBlackNode;
  nil: RedBlackNode;
  private nodeCounter: number = 0;
  private steps: AnimationStep[] = [];

  constructor() {
    this.nil = new RedBlackNode(0, Color.BLACK, 'nil');
    this.nil.left = this.nil;
    this.nil.right = this.nil;
    this.nil.parent = this.nil;
    this.root = this.nil;
  }

  private createNode(key: number): RedBlackNode {
    const node = new RedBlackNode(key, Color.RED, `node-${this.nodeCounter++}`);
    node.left = this.nil;
    node.right = this.nil;
    node.parent = this.nil;
    return node;
  }

  private recordStep(message: string, type: AnimationStep['type'], focusNodeId?: string) {
    this.steps.push({
      root: this.cloneTree(this.root),
      message,
      type,
      focusNodeId,
    });
  }

  // Deep clone the tree for snapshots
  private cloneTree(node: RedBlackNode): RedBlackNode {
    if (node === this.nil) return this.nil;
    const newNode = node.clone();
    newNode.left = this.cloneTree(node.left);
    newNode.right = this.cloneTree(node.right);
    return newNode;
  }

  getSteps(): AnimationStep[] {
    return this.steps;
  }

  clearSteps() {
    this.steps = [];
  }

  leftRotate(x: RedBlackNode) {
    const y = x.right;
    x.right = y.left;
    if (y.left !== this.nil) {
      y.left.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === this.nil) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
    this.recordStep(`Left rotation at ${x.key}`, 'ROTATE', y.id);
  }

  rightRotate(y: RedBlackNode) {
    const x = y.left;
    y.left = x.right;
    if (x.right !== this.nil) {
      x.right.parent = y;
    }
    x.parent = y.parent;
    if (y.parent === this.nil) {
      this.root = x;
    } else if (y === y.parent.right) {
      y.parent.right = x;
    } else {
      y.parent.left = x;
    }
    x.right = y;
    y.parent = x;
    this.recordStep(`Right rotation at ${y.key}`, 'ROTATE', x.id);
  }

  insert(key: number) {
    this.clearSteps();
    let z = this.createNode(key);
    let y = this.nil;
    let x = this.root;

    while (x !== this.nil) {
      y = x;
      if (z.key < x.key) {
        x = x.left;
      } else {
        x = x.right;
      }
    }

    z.parent = y;
    if (y === this.nil) {
      this.root = z;
    } else if (z.key < y.key) {
      y.left = z;
    } else {
      y.right = z;
    }
    z.left = this.nil;
    z.right = this.nil;
    z.color = Color.RED;

    this.recordStep(`BST Insert ${key}`, 'BST_INSERT', z.id);
    this.insertFixup(z);
    this.recordStep(`Insertion complete for ${key}`, 'FINAL');
  }

  private insertFixup(z: RedBlackNode) {
    while (z.parent.color === Color.RED) {
      if (z.parent === z.parent.parent.left) {
        let y = z.parent.parent.right;
        if (y.color === Color.RED) {
          // Case 1
          this.recordStep('Insertion Case 1: Uncle is red. Recoloring...', 'CASE_EXPLANATION', z.id);
          z.parent.color = Color.BLACK;
          y.color = Color.BLACK;
          z.parent.parent.color = Color.RED;
          this.recordStep('Recolored parent, uncle, and grandparent', 'RECOLOR', z.id);
          z = z.parent.parent;
        } else {
          if (z === z.parent.right) {
            // Case 2
            this.recordStep('Insertion Case 2: Uncle is black, node is right child. Rotating left...', 'CASE_EXPLANATION', z.id);
            z = z.parent;
            this.leftRotate(z);
          }
          // Case 3
          this.recordStep('Insertion Case 3: Uncle is black, node is left child. Rotating right...', 'CASE_EXPLANATION', z.id);
          z.parent.color = Color.BLACK;
          z.parent.parent.color = Color.RED;
          this.recordStep('Recolored parent and grandparent', 'RECOLOR', z.id);
          this.rightRotate(z.parent.parent);
        }
      } else {
        // Symmetric cases
        let y = z.parent.parent.left;
        if (y.color === Color.RED) {
          // Case 1 (Symmetric)
          this.recordStep('Insertion Case 1: Uncle is red. Recoloring...', 'CASE_EXPLANATION', z.id);
          z.parent.color = Color.BLACK;
          y.color = Color.BLACK;
          z.parent.parent.color = Color.RED;
          this.recordStep('Recolored parent, uncle, and grandparent', 'RECOLOR', z.id);
          z = z.parent.parent;
        } else {
          if (z === z.parent.left) {
            // Case 2 (Symmetric)
            this.recordStep('Insertion Case 2: Uncle is black, node is left child. Rotating right...', 'CASE_EXPLANATION', z.id);
            z = z.parent;
            this.rightRotate(z);
          }
          // Case 3 (Symmetric)
          this.recordStep('Insertion Case 3: Uncle is black, node is right child. Rotating left...', 'CASE_EXPLANATION', z.id);
          z.parent.color = Color.BLACK;
          z.parent.parent.color = Color.RED;
          this.recordStep('Recolored parent and grandparent', 'RECOLOR', z.id);
          this.leftRotate(z.parent.parent);
        }
      }
    }
    if (this.root.color !== Color.BLACK) {
      this.root.color = Color.BLACK;
      this.recordStep('Setting root to Black', 'RECOLOR', this.root.id);
    }
  }

  delete(key: number) {
    this.clearSteps();
    const z = this.findNode(this.root, key);
    if (z === this.nil) {
      this.recordStep(`Node ${key} not found`, 'FINAL');
      return;
    }

    let y = z;
    let yOriginalColor = y.color;
    let x: RedBlackNode;
    let xParent: RedBlackNode;

    if (z.left === this.nil) {
      x = z.right;
      xParent = z.parent;
      this.transplant(z, z.right);
    } else if (z.right === this.nil) {
      x = z.left;
      xParent = z.parent;
      this.transplant(z, z.left);
    } else {
      y = this.treeMinimum(z.right);
      yOriginalColor = y.color;
      x = y.right;
      if (y.parent === z) {
        xParent = y;
      } else {
        xParent = y.parent;
        this.transplant(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }
      this.transplant(z, y);
      y.left = z.left;
      y.left.parent = y;
      y.color = z.color;
    }

    this.recordStep(`BST Delete ${key}`, 'BST_DELETE');
    if (yOriginalColor === Color.BLACK) {
      this.deleteFixup(x, xParent);
    }
    this.recordStep(`Deletion complete for ${key}`, 'FINAL');
  }

  private deleteFixup(x: RedBlackNode, xParent: RedBlackNode) {
    while (x !== this.root && x.color === Color.BLACK) {
      if (x === xParent.left || (x === this.nil && xParent.left === this.nil && x === this.nil)) { 
        // Note: the (x === this.nil ...) check is a bit tricky if both children are nil.
        // But x is specifically the child that was moved.
        let w = xParent.right;
        if (w.color === Color.RED) {
          // Case 1
          this.recordStep('Deletion Case 1: Sibling is red. Rotating left...', 'CASE_EXPLANATION', x.id);
          w.color = Color.BLACK;
          xParent.color = Color.RED;
          this.leftRotate(xParent);
          w = xParent.right;
        }
        if (w.left.color === Color.BLACK && w.right.color === Color.BLACK) {
          // Case 2
          this.recordStep('Deletion Case 2: Sibling is black and both its children are black. Recoloring...', 'CASE_EXPLANATION', x.id);
          w.color = Color.RED;
          this.recordStep('Recolored sibling red', 'RECOLOR', w.id);
          x = xParent;
          xParent = x.parent;
        } else {
          if (w.right.color === Color.BLACK) {
            // Case 3
            this.recordStep('Deletion Case 3: Sibling is black, left child red, right child black. Rotating right...', 'CASE_EXPLANATION', x.id);
            w.left.color = Color.BLACK;
            w.color = Color.RED;
            this.rightRotate(w);
            w = xParent.right;
          }
          // Case 4
          this.recordStep('Deletion Case 4: Sibling is black, right child red. Rotating left...', 'CASE_EXPLANATION', x.id);
          w.color = xParent.color;
          xParent.color = Color.BLACK;
          w.right.color = Color.BLACK;
          this.leftRotate(xParent);
          x = this.root;
          xParent = this.nil;
        }
      } else {
        // Symmetric cases
        let w = xParent.left;
        if (w.color === Color.RED) {
          // Case 1 (Symmetric)
          this.recordStep('Deletion Case 1: Sibling is red. Rotating right...', 'CASE_EXPLANATION', x.id);
          w.color = Color.BLACK;
          xParent.color = Color.RED;
          this.rightRotate(xParent);
          w = xParent.left;
        }
        if (w.right.color === Color.BLACK && w.left.color === Color.BLACK) {
          // Case 2 (Symmetric)
          this.recordStep('Deletion Case 2: Sibling is black and both its children are black. Recoloring...', 'CASE_EXPLANATION', x.id);
          w.color = Color.RED;
          this.recordStep('Recolored sibling red', 'RECOLOR', w.id);
          x = xParent;
          xParent = x.parent;
        } else {
          if (w.left.color === Color.BLACK) {
            // Case 3 (Symmetric)
            this.recordStep('Deletion Case 3: Sibling is black, right child red, left child black. Rotating left...', 'CASE_EXPLANATION', x.id);
            w.right.color = Color.BLACK;
            w.color = Color.RED;
            this.leftRotate(w);
            w = xParent.left;
          }
          // Case 4 (Symmetric)
          this.recordStep('Deletion Case 4: Sibling is black, left child red. Rotating right...', 'CASE_EXPLANATION', x.id);
          w.color = xParent.color;
          xParent.color = Color.BLACK;
          w.left.color = Color.BLACK;
          this.rightRotate(xParent);
          x = this.root;
          xParent = this.nil;
        }
      }
    }
    if (x.color !== Color.BLACK) {
      x.color = Color.BLACK;
      this.recordStep('Setting node to Black', 'RECOLOR', x.id);
    }
  }


  private transplant(u: RedBlackNode, v: RedBlackNode) {
    if (u.parent === this.nil) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    if (v !== this.nil) {
      v.parent = u.parent;
    }
  }

  private treeMinimum(x: RedBlackNode): RedBlackNode {
    while (x.left !== this.nil) {
      x = x.left;
    }
    return x;
  }

  private findNode(x: RedBlackNode, key: number): RedBlackNode {
    if (x === this.nil || key === x.key) {
      return x;
    }
    if (key < x.key) {
      return this.findNode(x.left, key);
    } else {
      return this.findNode(x.right, key);
    }
  }

  // To be used by the visualization
  search(key: number): RedBlackNode {
    return this.findNode(this.root, key);
  }
}
