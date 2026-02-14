import React, { useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

const RemarksBoard = ({ pageName }) => {
  const canvasRef = useRef(null);

  const clearCanvas = () => {
    canvasRef.current.clearCanvas();
  };

  return (
    <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "#fff" }}>
      <h4>📝 Personal Remarks for {pageName}</h4>
      <p style={{ fontSize: "12px", color: "gray" }}>Draw quick notes or scribbles here.</p>
      
      <ReactSketchCanvas
        ref={canvasRef}
        style={{ border: "1px solid #ccc", borderRadius: "5px" }}
        width="100%"
        height="200px"
        strokeWidth={3}
        strokeColor="black"
      />
      
      <div style={{ marginTop: "10px" }}>
        <button onClick={clearCanvas} style={btnStyle}>Clear Board</button>
      </div>
    </div>
  );
};

// Simple inline styles for the button
const btnStyle = {
  padding: "8px 15px",
  background: "#ff4d4d",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

export default RemarksBoard;