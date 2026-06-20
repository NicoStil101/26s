import React, { useState, useEffect, useRef } from 'react';
import { RedBlackTree, type AnimationStep } from './lib/RedBlackTree';
import TreeView from './components/TreeView';

const App: React.FC = () => {
  const [treeInstance] = useState(new RedBlackTree());
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  
  const timerRef = useRef<number | null>(null);

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  const handleInsert = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    
    treeInstance.insert(val);
    const newSteps = treeInstance.getSteps();
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsAnimating(true);
    setInputValue('');
  };

  const handleDelete = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    
    treeInstance.delete(val);
    const newSteps = treeInstance.getSteps();
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsAnimating(true);
    setInputValue('');
  };

  const handleSearch = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    
    const node = treeInstance.search(val);
    if (node !== treeInstance.nil) {
      setSteps([{
        root: treeInstance.root,
        message: `Node ${val} found!`,
        focusNodeId: node.id,
        type: 'FINAL'
      }]);
      setCurrentStepIndex(0);
    } else {
      setSteps([{
        root: treeInstance.root,
        message: `Node ${val} not found.`,
        type: 'FINAL'
      }]);
      setCurrentStepIndex(0);
    }
    setInputValue('');
  };

  useEffect(() => {
    if (isAnimating && currentStepIndex < steps.length - 1) {
      timerRef.current = window.setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, animationSpeed);
    } else {
      setIsAnimating(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAnimating, currentStepIndex, steps.length, animationSpeed]);

  const treeToShow = currentStep ? currentStep.root : treeInstance.root;
  const messageToShow = currentStep ? currentStep.message : "Tree ready. Enter a value to begin.";
  const focusNodeId = currentStep?.focusNodeId;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Red-Black Tree Visualizer</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input 
          type="number" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={handleInsert}
          disabled={isAnimating}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}
        >
          Insert
        </button>
        <button 
          onClick={handleDelete}
          disabled={isAnimating}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#f44336', color: 'white', cursor: 'pointer' }}
        >
          Delete
        </button>
        <button 
          onClick={handleSearch}
          disabled={isAnimating}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#2196F3', color: 'white', cursor: 'pointer' }}
        >
          Search
        </button>
        
        <div style={{ marginLeft: '20px' }}>
          <label>Speed: </label>
          <input 
            type="range" 
            min="100" 
            max="3000" 
            step="100" 
            value={animationSpeed} 
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '8px', 
        marginBottom: '20px',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
        color: '#1565c0',
        border: '1px solid #bbdefb'
      }}>
        {messageToShow}
      </div>

      <TreeView 
        root={treeToShow} 
        nil={treeInstance.nil} 
        focusNodeId={focusNodeId}
      />

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h3>Red-Black Tree Properties:</h3>
        <ul>
          <li>Every node is either red or black.</li>
          <li>The root is black.</li>
          <li>Every leaf (NIL) is black.</li>
          <li>If a node is red, both its children are black.</li>
          <li>For each node, all simple paths from the node to descendant leaves contain the same number of black nodes.</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
