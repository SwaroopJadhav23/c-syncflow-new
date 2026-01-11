import React, { useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

const RemarksBoard = ({ pageName }) => {
  const canvasRef = useRef(null);

  const clearCanvas = () => {
    canvasRef.current.clearCanvas();
  };

  return (
    <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "#fff", width: "100%", overflow: "hidden" }}>
      <h4 style={{ fontSize: "clamp(1rem, 3vw, 1.2rem)", marginBottom: "10px" }}>📝 Personal Remarks for {pageName}</h4>
      <p style={{ fontSize: "12px", color: "gray", marginBottom: "10px" }}>Draw quick notes or scribbles here.</p>
      
      <div style={{ width: "100%", overflow: "hidden", borderRadius: "5px", border: "1px solid #ccc" }}>
        <ReactSketchCanvas
          ref={canvasRef}
          style={{ border: "none", width: "100%", maxWidth: "100%" }}
          width="100%"
          height="200px"
          strokeWidth={3}
          strokeColor="black"
        />
      </div>
      
      <div style={{ marginTop: "10px" }}>
        <button onClick={clearCanvas} style={btnStyle}>Clear Board</button>
      </div>
    </div>
  );
};

// Simple inline styles for the button
const btnStyle = {
  padding: "12px 20px",
  background: "#ff4d4d",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold",
  minHeight: "44px",
  width: "100%",
  maxWidth: "200px"
};

export default RemarksBoard;