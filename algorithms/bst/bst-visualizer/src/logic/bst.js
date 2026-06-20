export const NIL = null;

export class Node {
  constructor(key) {
    this.key = key;
    this.left = NIL;
    this.right = NIL;
    this.parent = NIL;
  }
}

// Visual insertion generator
export function* BSTInsert(root, key) {
  const z = new Node(key);
  let y = NIL;
  let x = root;
  
  yield { type: 'start', node: NIL, msg: `Starting insertion of key ${key}.` };

  if (root === NIL) {
    yield { type: 'final', node: z, msg: `Tree was empty. ${key} becomes the root.` };
    return z;
  }

  while (x !== NIL) {
    y = x;
    yield { type: 'visit', node: x, msg: `Comparing ${key} with ${x.key}.` };
    if (z.key < x.key) {
      x = x.left;
      if (x !== NIL) yield { type: 'visit', node: x, msg: `${key} < ${y.key}, moving left.` };
    } else {
      x = x.right;
      if (x !== NIL) yield { type: 'visit', node: x, msg: `${key} >= ${y.key}, moving right.` };
    }
  }

  z.parent = y;
  if (z.key < y.key) {
    y.left = z;
    yield { type: 'final', node: z, msg: `Inserted ${key} as left child of ${y.key}.` };
  } else {
    y.right = z;
    yield { type: 'final', node: z, msg: `Inserted ${key} as right child of ${y.key}.` };
  }
  return root;
}

// Helper for non-visual insertion (initial build)
export function insert(root, key) {
  const z = new Node(key);
  let y = NIL;
  let x = root;
  while (x !== NIL) {
    y = x;
    if (z.key < x.key) x = x.left;
    else x = x.right;
  }
  z.parent = y;
  if (y === NIL) return z;
  else if (z.key < y.key) y.left = z;
  else y.right = z;
  return root;
}

export function findNode(node, key) {
  if (node === NIL || key === node.key) return node;
  if (key < node.key) return findNode(node.left, key);
  return findNode(node.right, key);
}

export function* BSTMin(x) {
  yield { type: 'visit', node: x, msg: `Checking node ${x.key} for leftmost child.` };
  while (x.left !== NIL) {
    x = x.left;
    yield { type: 'visit', node: x, msg: `Moving left to node ${x.key}.` };
  }
  return x;
}

export function* BSTMax(x) {
  yield { type: 'visit', node: x, msg: `Checking node ${x.key} for rightmost child.` };
  while (x.right !== NIL) {
    x = x.right;
    yield { type: 'visit', node: x, msg: `Moving right to node ${x.key}.` };
  }
  return x;
}

// Transplant helper (internal logic, not visualized separately)
function transplant(root, u, v) {
  if (u.parent === NIL) {
    root = v;
  } else if (u === u.parent.left) {
    u.parent.left = v;
  } else {
    u.parent.right = v;
  }
  if (v !== NIL) {
    v.parent = u.parent;
  }
  return root;
}

export function* BSTDelete(root, z) {
  yield { type: 'start', node: z, msg: `Starting deletion of node ${z.key}.` };

  if (z.left === NIL) {
    yield { type: 'visit', node: z, msg: `Node ${z.key} has no left child. Replacing with right child.` };
    root = transplant(root, z, z.right);
  } else if (z.right === NIL) {
    yield { type: 'visit', node: z, msg: `Node ${z.key} has no right child. Replacing with left child.` };
    root = transplant(root, z, z.left);
  } else {
    yield { type: 'visit', node: z, msg: `Node ${z.key} has two children. Finding successor to swap.` };
    // Successor is min of right subtree
    const minGen = BSTMin(z.right);
    let res;
    while (!(res = minGen.next()).done) yield res.value;
    const y = res.value;

    if (y.parent !== z) {
      yield { type: 'visit', node: y, msg: `Successor ${y.key} is not a direct child. Moving it up.` };
      root = transplant(root, y, y.right);
      y.right = z.right;
      y.right.parent = y;
    }
    
    yield { type: 'visit', node: y, msg: `Replacing ${z.key} with successor ${y.key}.` };
    root = transplant(root, z, y);
    y.left = z.left;
    y.left.parent = y;
  }

  yield { type: 'final', node: NIL, msg: `Deletion complete.` };
  return root;
}

export function* BSTSuccessor(x) {
  yield { type: 'start', node: x, msg: `Finding successor of node ${x.key}.` };

  if (x.right !== NIL) {
    yield { type: 'case1', node: x, msg: `Case 1: Right subtree exists. Searching for minimum in right subtree.` };
    const minGen = BSTMin(x.right);
    let result;
    while (!(result = minGen.next()).done) yield result.value;
    const successor = result.value;
    yield { type: 'final', node: successor, msg: `Successor is ${successor.key}.` };
    return successor;
  }

  yield { type: 'case2', node: x, msg: `Case 2: Right subtree is empty. Moving up parent pointers.` };
  let y = x.parent;
  while (y !== NIL && x === y.right) {
    x = y;
    y = y.parent;
    if (y !== NIL) yield { type: 'visit', node: y, msg: `Node was a right child. Moving up to parent ${y.key}.` };
  }

  if (y !== NIL) {
    yield { type: 'final', node: y, msg: `Found ancestor where node is in left subtree. Successor is ${y.key}.` };
  } else {
    yield { type: 'final', node: NIL, msg: `No successor found (node is the maximum).` };
  }
  return y;
}

export function* BSTPredecessor(x) {
  yield { type: 'start', node: x, msg: `Finding predecessor of node ${x.key}.` };

  if (x.left !== NIL) {
    yield { type: 'case1', node: x, msg: `Case 1: Left subtree exists. Searching for maximum in left subtree.` };
    const maxGen = BSTMax(x.left);
    let result;
    while (!(result = maxGen.next()).done) yield result.value;
    const predecessor = result.value;
    yield { type: 'final', node: predecessor, msg: `Predecessor is ${predecessor.key}.` };
    return predecessor;
  }

  yield { type: 'case2', node: x, msg: `Case 2: Left subtree is empty. Moving up parent pointers.` };
  let y = x.parent;
  while (y !== NIL && x === y.left) {
    x = y;
    y = y.parent;
    if (y !== NIL) yield { type: 'visit', node: y, msg: `Node was a left child. Moving up to parent ${y.key}.` };
  }

  if (y !== NIL) {
    yield { type: 'final', node: y, msg: `Found ancestor where node is in right subtree. Predecessor is ${y.key}.` };
  } else {
    yield { type: 'final', node: NIL, msg: `No predecessor found (node is the minimum).` };
  }
  return y;
}

export function* BSTInorder(node) {
  if (node === NIL) return;

  yield { type: 'visit', node: node, msg: `Traversing left subtree of ${node.key}.` };
  yield* BSTInorder(node.left);

  yield { type: 'inorder_visit', node: node, msg: `Visiting node ${node.key} (Added to inorder sequence).` };

  yield { type: 'visit', node: node, msg: `Traversing right subtree of ${node.key}.` };
  yield* BSTInorder(node.right);
}

export function buildLectureTree() {
  const keys = [15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9];
  return buildTreeFromArray(keys);
}

export function buildTreeFromArray(keys) {
  let root = NIL;
  keys.forEach(k => {
    if (!isNaN(k)) {
      root = insert(root, k);
    }
  });
  return root;
}
