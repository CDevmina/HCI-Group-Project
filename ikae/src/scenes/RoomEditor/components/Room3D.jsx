// components/Room3D.jsx
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Box,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";

const Wall = ({ position, size, color, onClick }) => {
  return (
    <Box args={size} position={position} onClick={onClick}>
      <meshStandardMaterial color={color} />
    </Box>
  );
};

const Furniture = ({ item }) => {
  const { position, rotation, size, color } = item;

  return (
    <Box args={size} position={position} rotation={rotation}>
      <meshStandardMaterial color={color} />
    </Box>
  );
};

const CameraControls = ({ minDistance, maxDistance }) => {
  const controls = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (controls.current) {
      // Set zoom limits
      controls.current.minDistance = minDistance;
      controls.current.maxDistance = maxDistance;

      // Enable damping for smoother camera movement
      controls.current.enableDamping = true;
      controls.current.dampingFactor = 0.1;

      // Set camera initial position for better view
      camera.position.set(0, 5, 8);
      camera.lookAt(0, 0, 0);
    }
  }, [controls, camera, minDistance, maxDistance]);

  return <OrbitControls ref={controls} />;
};

const Room3D = ({
  roomDimensions,
  walls,
  furniture,
  onWallClick,
  onFurnitureSelect,
  onFurnitureDrag,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cameraPosition, setCameraPosition] = useState([0, 5, 8]);

  // Calculate wall positions and sizes based on room dimensions
  const createWalls = () => {
    const { width, height, length } = roomDimensions;
    const wallThickness = 0.2;

    const wallsConfig = [
      // Floor
      {
        position: [0, -height / 2, 0],
        size: [width, wallThickness, length],
        color: "#f0f0f0",
        id: "floor",
      },
      // Ceiling
      {
        position: [0, height / 2, 0],
        size: [width, wallThickness, length],
        color: "#ffffff",
        id: "ceiling",
      },
      // Back wall
      {
        position: [0, 0, -length / 2],
        size: [width, height, wallThickness],
        color: walls.back?.color || "#e0e0e0",
        id: "back",
      },
      // Front wall
      {
        position: [0, 0, length / 2],
        size: [width, height, wallThickness],
        color: walls.front?.color || "#e0e0e0",
        id: "front",
      },
      // Left wall
      {
        position: [-width / 2, 0, 0],
        size: [wallThickness, height, length],
        color: walls.left?.color || "#d0d0d0",
        id: "left",
      },
      // Right wall
      {
        position: [width / 2, 0, 0],
        size: [wallThickness, height, length],
        color: walls.right?.color || "#d0d0d0",
        id: "right",
      },
    ];

    return wallsConfig;
  };

  const handleWallClick = (event, wallId) => {
    event.stopPropagation();
    if (onWallClick) {
      onWallClick(wallId);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setCameraPosition([0, 5, 8]);
  };

  const wallsConfig = createWalls();

  return (
    <div
      className="room3d-container"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <Canvas shadows>
        {/* Camera setup with controlled zoom */}
        <PerspectiveCamera
          makeDefault
          position={cameraPosition}
          zoom={zoomLevel}
        />
        <CameraControls minDistance={3} maxDistance={15} />

        {/* Lighting setup */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <Environment preset="apartment" />

        {/* Room walls */}
        {wallsConfig.map((wall, index) => (
          <Wall
            key={index}
            position={wall.position}
            size={wall.size}
            color={wall.color}
            onClick={(e) => handleWallClick(e, wall.id)}
          />
        ))}

        {/* Furniture items */}
        {furniture.map((item, index) => (
          <Furniture key={index} item={item} />
        ))}
      </Canvas>

      {/* Zoom controls overlay */}
      <div
        className="zoom-controls"
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          background: "rgba(255, 255, 255, 0.8)",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <button onClick={handleZoomIn} className="zoom-btn">
          <span role="img" aria-label="zoom in">
            ➕
          </span>
        </button>
        <button onClick={handleZoomOut} className="zoom-btn">
          <span role="img" aria-label="zoom out">
            ➖
          </span>
        </button>
        <button onClick={handleResetView} className="zoom-btn">
          <span role="img" aria-label="reset view">
            🔄
          </span>
        </button>
      </div>
    </div>
  );
};

export default Room3D;
