// components/ViewToggle.jsx
import React from "react";
import {
  CubeTransparentIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";

const ViewToggle = ({ is3DView, setIs3DView }) => {
  return (
    <div className="view-toggle">
      <button
        className={!is3DView ? "active" : ""}
        onClick={() => setIs3DView(false)}
        title="2D View"
      >
        <CubeTransparentIcon style={{ width: "20px", height: "20px" }} />
        <span>2D</span>
      </button>
      <button
        className={is3DView ? "active" : ""}
        onClick={() => setIs3DView(true)}
        title="3D View"
      >
        <Square3Stack3DIcon style={{ width: "20px", height: "20px" }} />
        <span>3D</span>
      </button>
    </div>
  );
};

export default ViewToggle;
