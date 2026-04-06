"use client";
import React, { useState, useCallback } from 'react';
import ReactFlow, { applyNodeChanges, addEdge, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

export default function WritingApp() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // This function adds a new node to the map
  const addNode = () => {
    const newNode = {
      id: `node-${nodes.length + 1}`,
      data: { 
        label: `Chapter ${nodes.length + 1}`, 
        objective: '', 
        facts: '' 
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      style: { border: '1px solid #777', padding: '10px', borderRadius: '5px', background: '#fff' }
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', fontFamily: 'sans-serif' }}>
      
      {/* LEFT PANE: THE VISUAL MAP */}
      <div style={{ flex: 2, position: 'relative', borderRight: '2px solid #eee' }}>
        <button 
          onClick={addNode}
          style={{ position: 'absolute', top: 10, left: 10, zIndex: 4, padding: '10px 20px', cursor: 'pointer', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          + Add Chapter Node
        </button>
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange} 
          onConnect={onConnect}
          fitView
        >
          <Background color="#aaa" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      {/* RIGHT PANE: THE LINEAR LIST */}
      <div style={{ flex: 1, padding: '40px', backgroundColor: '#fafafa', overflowY: 'auto' }}>
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Writing Outline</h2>
        {nodes.length === 0 && <p style={{ color: '#888' }}>Add a node on the map to start your outline.</p>}
        <div style={{ marginTop: '20px' }}>
          {nodes.map((node, index) => (
            <div key={node.id} style={{ background: '#fff', padding: '15px', marginBottom: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '5px solid #0070f3' }}>
              <strong>{index + 1}. {node.data.label}</strong>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>ID: {node.id}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}