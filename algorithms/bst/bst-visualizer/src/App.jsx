import React, { useState, useEffect, useCallback } from 'react';
import { Play, SkipForward, RotateCcw, PlusCircle, Trash2, StepForward, StepBack, List } from 'lucide-react';
import { buildLectureTree, buildTreeFromArray, findNode, BSTSuccessor, BSTPredecessor, BSTInorder, BSTInsert, BSTDelete, NIL } from './logic/bst';
import TreeVisualizer from './components/TreeVisualizer';

const App = () => {
  const [root, setRoot] = useState(null);
  const [mode, setMode] = useState('successor'); // 'successor' | 'predecessor' | 'insert' | 'delete' | 'inorder'
  const [selectedKey, setSelectedKey] = useState(6);
  const [inputKey, setInputKey] = useState('');
  const [arrayInput, setArrayInput] = useState('15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9');
  const [activeNode, setActiveNode] = useState(null);
  const [successorNode, setSuccessorNode] = useState(null);
  const [pathNodes, setPathNodes] = useState([]);
  const [traversalSequence, setTraversalSequence] = useState([]);
  const [statusMsg, setStatusMsg] = useState('Select an operation and click "Start".');
  const [generator, setGenerator] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [modalNode, setModalNode] = useState(null);

  useEffect(() => {
    setRoot(buildLectureTree());
  }, []);

  const handleNodeClick = (key, x, y) => {
    const node = findNode(root, key);
    if (node) {
      setModalNode({
        key: node.key,
        parent: node.parent ? node.parent.key : 'None (Root)',
        left: node.left ? node.left.key : 'None',
        right: node.right ? node.right.key : 'None',
        x: x + 60, // Offset to the right
        y: y + 20  // Slight vertical offset
      });
    }
  };

  const handleStart = () => {
    let gen;
    if (mode === 'successor') {
      const node = findNode(root, parseInt(selectedKey));
      if (!node) {
        setStatusMsg(`Node ${selectedKey} not found in tree.`);
        return;
      }
      gen = BSTSuccessor(node);
    } else if (mode === 'predecessor') {
      const node = findNode(root, parseInt(selectedKey));
      if (!node) {
        setStatusMsg(`Node ${selectedKey} not found in tree.`);
        return;
      }
      gen = BSTPredecessor(node);
    } else if (mode === 'inorder') {
      gen = BSTInorder(root);
    } else if (mode === 'insert') {
      const key = parseInt(inputKey);
      if (isNaN(key)) {
        setStatusMsg('Please enter a valid numeric key to insert.');
        return;
      }
      gen = BSTInsert(root, key);
    } else if (mode === 'delete') {
      const node = findNode(root, parseInt(selectedKey));
      if (!node) {
        setStatusMsg(`Node ${selectedKey} not found in tree.`);
        return;
      }
      gen = BSTDelete(root, node);
    }

    setGenerator(gen);
    setActiveNode(null);
    setSuccessorNode(null);
    setPathNodes([]);
    setTraversalSequence([]);
    setIsFinished(false);
  };

  const handleStep = useCallback(() => {
    if (!generator || isFinished) return;

    const { value, done } = generator.next();
    
    if (done) {
      if (mode === 'insert' || mode === 'delete') {
        setRoot(value); // Update actual tree after visual steps
      }
      if (mode === 'inorder') {
        setStatusMsg('Inorder Traversal complete.');
      }
      setIsFinished(true);
      return;
    }

    const { type, node, msg } = value;
    setStatusMsg(msg);
    setActiveNode(node);

    if (node && node !== NIL) {
      if (type === 'inorder_visit') {
        setTraversalSequence(prev => [...prev, node.key]);
      }
      setPathNodes(prev => [...new Set([...prev, node.key])]);
    }

    if (type === 'final') {
      if (mode === 'successor' || mode === 'predecessor') {
        setSuccessorNode(node);
      }
      setIsFinished(true);
      // For insert/delete, the generator returns the new root when done
      const nextStep = generator.next();
      if (nextStep.done && nextStep.value) {
        setRoot(nextStep.value);
      }
    }
  }, [generator, isFinished, mode]);

  const handleReset = () => {
    setRoot(buildLectureTree());
    setGenerator(null);
    setActiveNode(null);
    setSuccessorNode(null);
    setPathNodes([]);
    setTraversalSequence([]);
    setIsFinished(false);
    setStatusMsg('Tree reset to lecture default.');
  };

  const handleBuildFromArray = () => {
    const keys = arrayInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (keys.length === 0) {
      setStatusMsg('Please enter a valid list of numbers.');
      return;
    }
    setRoot(buildTreeFromArray(keys));
    setSelectedKey(keys[0]);
    setGenerator(null);
    setActiveNode(null);
    setSuccessorNode(null);
    setPathNodes([]);
    setIsFinished(false);
    setStatusMsg(`Built new tree from array: [${keys.join(', ')}]`);
  };

  const getKeys = () => {
    const keys = [];
    const traverse = (node) => {
      if (!node) return;
      keys.push(node.key);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(root);
    return keys.sort((a, b) => a - b);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">ADS Lab</h1>
          <p className="text-slate-600 italic">Insert, Delete, and find Successors live</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-2">
              Controls
            </h2>
            
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Operation</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'successor', label: 'Find Successor', icon: StepForward },
                    { id: 'predecessor', label: 'Find Predecessor', icon: StepBack },
                    { id: 'inorder', label: 'Inorder Traversal', icon: List },
                    { id: 'insert', label: 'Insert Node', icon: PlusCircle },
                    { id: 'delete', label: 'Delete Node', icon: Trash2 },
                  ].map(op => (
                    <button
                      key={op.id}
                      onClick={() => { setMode(op.id); handleReset(); }}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                        mode === op.id ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 border-slate-200 hover:border-blue-300 text-slate-600'
                      }`}
                    >
                      <op.icon size={18} />
                      <span className="font-semibold">{op.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {mode !== 'insert' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Target Node</label>
                  <select 
                    value={selectedKey} 
                    onChange={(e) => setSelectedKey(e.target.value)}
                    disabled={generator && !isFinished}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {getKeys().map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Key to Insert</label>
                  <input
                    type="number"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Enter value..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}
            </div>

            <div className="pt-4 border-t mb-6">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Build Tree from Array</label>
              <textarea
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                placeholder="e.g., 10, 5, 15, 2, 7"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm mb-2 h-20 resize-none"
              />
              <button 
                onClick={handleBuildFromArray}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm"
              >
                Apply Custom Array
              </button>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <button 
                onClick={handleStart}
                disabled={generator && !isFinished}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
              >
                <Play size={18} /> Start
              </button>
              
              <button 
                onClick={handleStep}
                disabled={!generator || isFinished}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
              >
                <SkipForward size={18} /> Next Step
              </button>
              
              <button 
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors"
              >
                <RotateCcw size={18} /> Reset Tree
              </button>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 min-h-[500px] flex flex-col relative">
              <TreeVisualizer 
                root={root} 
                activeNode={activeNode} 
                successorNode={successorNode}
                pathNodes={pathNodes}
                onNodeClick={handleNodeClick}
              />

              {/* Node Detail Popup Overlay (Dynamic Position) */}
              {modalNode && (
                <div 
                  className="absolute z-50 animate-in fade-in zoom-in-95 duration-200 pointer-events-none"
                  style={{ left: `${modalNode.x}px`, top: `${modalNode.y}px` }}
                >
                  <div className="bg-slate-900/90 text-white backdrop-blur-md rounded-lg shadow-2xl p-3 w-40 border border-slate-700 pointer-events-auto">
                    <div className="flex justify-between items-center mb-1 border-b border-slate-700 pb-1">
                      <h3 className="text-xs font-bold">Node {modalNode.key}</h3>
                      <button 
                        onClick={() => setModalNode(null)}
                        className="text-slate-400 hover:text-white transition-colors text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-500 uppercase">Parent</span>
                        <span className="font-mono font-bold">{modalNode.parent}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-blue-400 uppercase">Left</span>
                        <span className="font-mono font-bold text-blue-300">{modalNode.left}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-indigo-400 uppercase">Right</span>
                        <span className="font-mono font-bold text-indigo-300">{modalNode.right}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-800 text-slate-100 p-6 rounded-2xl shadow-xl border-l-8 border-blue-500">
              <h3 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-2">
                Algorithm: {mode.toUpperCase()}
              </h3>
              <p className="text-lg leading-relaxed font-medium mb-4">
                {statusMsg}
              </p>
              
              {traversalSequence.length > 0 && (
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Inorder Sequence</h4>
                  <div className="flex flex-wrap gap-2">
                    {traversalSequence.map((key, idx) => (
                      <span key={idx} className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-mono animate-in zoom-in duration-300">
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
