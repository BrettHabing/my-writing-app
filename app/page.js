"use client";
import React, { useState, useCallback } from 'react';
import ReactFlow, { applyNodeChanges, addEdge, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

export default function WritingApp() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [aiOutput, setAiOutput] = useState('');

  const addNode = () => {
    const id = `node-${Date.now()}`;
    const newNode = {
      id,
      data: { label: `New Chapter`, objective: '', facts: '' },
      position: { x: 100, y: 100 },
      style: { border: '1px solid #777', padding: '10px', borderRadius: '5px', background: '#fff', width: 150 }
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onNodesChange = useCallback((chs) => setNodes((nds) => applyNodeChanges(chs, nds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onNodeClick = (event, node) => setSelectedNodeId(node.id);

  const updateNodeData = (field, value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          return { ...node, data: { ...node.data, [field]: value } };
        }
        return node;
      })
    );
  };

  const generateScaffold = async () => {
    setAiOutput('Generating...');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapters: nodes.map(n => n.data) }),
      });
      const data = await response.json();
      setAiOutput(data.scaffold);
    } catch (error) {
      setAiOutput('Error generating scaffold. Please try again.');
    }
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', fontFamily: 'sans-serif' }}>
      
      {/* LEFT: THE MAP */}
      <div style={{ flex: 2, position: 'relative', borderRight: '2px solid #eee' }}>
        <button onClick={addNode} style={btnStyle}>+ Add Node</button>
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange} 
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* RIGHT: THE EDITING PANEL & OUTLINE */}
      <div style={{ flex: 1, padding: '30px', backgroundColor: '#fff', overflowY: 'auto', boxShadow: '-5px 0 15px rgba(0,0,0,0.05)' }}>
        {selectedNode ? (
          <div>
            <button onClick={() => setSelectedNodeId(null)} style={{ float: 'right', cursor: 'pointer' }}>✕</button>
            <h3>Edit Chapter</h3>
            <label style={labelStyle}>Title</label>
            <input 
              style={inputStyle}
              value={selectedNode.data.label} 
              onChange={(e) => updateNodeData('label', e.target.value)} 
            />
            <label style={labelStyle}>Objective</label>
            <textarea 
              style={textStyle}
              value={selectedNode.data.objective} 
              onChange={(e) => updateNodeData('objective', e.target.value)} 
            />
            <label style={labelStyle}>Key Supporting Facts</label>
            <textarea 
              style={{ ...textStyle, height: '150px' }}
              value={selectedNode.data.facts} 
              onChange={(e) => updateNodeData('facts', e.target.value)} 
              placeholder="Fact 1, Fact 2, etc."
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
            <p>Select a node on the map to edit details.</p>
            <hr style={{ margin: '20px 0' }} />
            <h4 style={{ color: '#333' }}>Outline Preview</h4>
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              {nodes.length === 0 ? <p>No chapters added yet.</p> : nodes.map((n, i) => (
                <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <strong>{i + 1}. {n.data.label}</strong>
                </div>
              ))}
            </div>
            
            <button 
              onClick={generateScaffold} 
              style={{ ...btnStyle, position: 'static', width: '100%', marginTop: '10px' }}
              disabled={nodes.length === 0}
            >
              Generate Writing Scaffold
            </button>

            {aiOutput && (
              <div style={aiBoxStyle}>
                <h4 style={{ marginTop: 0 }}>AI Scaffold</h4>
                {aiOutput}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const btnStyle = { position: 'absolute', top: 10, left: 10, zIndex: 4, padding: '10px', cursor: 'pointer', background: '#000', color: '#fff', border: 'none', borderRadius: '4px' };
const labelStyle = { display: 'block', marginTop: '20px', fontWeight: 'bold', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
const textStyle = { width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px', height: '80px', fontFamily: 'inherit', boxSizing: 'border-box' };
const aiBoxStyle = { marginTop: '20px', textAlign: 'left', whiteSpace: 'pre-wrap', fontSize: '14px', border: '1px solid #0070f3', borderRadius: '8px', padding: '15px', backgroundColor: '#f0f7ff', color: '#333' };