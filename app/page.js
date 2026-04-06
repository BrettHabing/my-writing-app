"use client";
import React, { useState } from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

export default function App() {
  const [nodes, setNodes] = useState([
    { id: '1', data: { label: 'Chapter 1' }, position: { x: 100, y: 100 } }
  ]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <div style={{ flex: 1, borderRight: '1px solid #000' }}>
        <ReactFlow nodes={nodes} />
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Outline</h1>
        <p>Your chapter cards will appear here.</p>
      </div>
    </div>
  );
}