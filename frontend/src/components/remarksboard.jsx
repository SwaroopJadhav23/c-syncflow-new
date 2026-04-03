import React, { useRef } from "react";
// import { ReactSketchCanvas } from "react-sketch-canvas"; // Temporarily disabled

// Simple canvas fallback component
const SimpleCanvas = ({ canvasRef }) => (
  <div style={{ border: "2px solid #ccc", borderRadius: "8px", padding: "10px" }}>
    <textarea
      ref={canvasRef}
      placeholder="Write your remarks here..."
      style={{
        width: "100%",
        height: "150px",
        border: "none",
        outline: "none",
        resize: "none",
        fontSize: "14px"
      }}
    />
  </div>
);

const RemarksBoard = ({ pageName }) => {
  const canvasRef = useRef(null);

  const clearCanvas = () => {
    canvasRef.current.value = "";
  };

  return (
    <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "#fff" }}>
      <h4>📝 Personal Remarks for {pageName}</h4>
      <p style={{ fontSize: "12px", color: "gray" }}>Write your remarks here...</p>
      
      <SimpleCanvas canvasRef={canvasRef} />
      
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