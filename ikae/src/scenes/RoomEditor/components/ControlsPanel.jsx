import { useEffect, useState } from 'react';
import fetchModels from '../utils/fetchModels';
import { TransformControls } from '@react-three/drei'; // Not needed here, but ensures context

export default function ControlsPanel({
  roomSize,
  setRoomSize,
  selectedItem,
  updateFurniture, // Use the central update function
  addFurniture,
  deleteFurniture,
  showDimensions,
  setShowDimensions,
  onPanelInteraction, // Receive the function to disable gizmo
  gizmoMode,         // Receive current mode
  setGizmoMode       // Receive mode setter
}) {
  const [color, setColor] = useState('#cccccc'); // Local color state - may be redundant if selectedItem.color is used
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetchModels().then(setModels);
  }, []);

  // --- START: Wrap panel updates with onPanelInteraction ---
  const handlePanelUpdate = (id, updates) => {
    onPanelInteraction(); // Notify that panel is being used
    updateFurniture(id, updates);
  };

  const handlePanelPositionChange = (axis, value) => {
    if (!selectedItem) return;
    onPanelInteraction(); // Disable gizmo on panel input
    const newPosition = { ...selectedItem.position };
    newPosition[axis] = Number(value); // Convert to number
    updateFurniture(selectedItem.id, { position: newPosition });
  };

   const handlePanelRotationChange = (value) => {
      if (!selectedItem) return;
      onPanelInteraction(); // Disable gizmo on panel input
      // Convert degrees from slider to radians for internal use
      updateFurniture(selectedItem.id, { rotation: Number(value) * (Math.PI / 180) });
   };

  const handlePanelColorChange = (e) => {
      if (!selectedItem) return;
      onPanelInteraction();
      handlePanelUpdate(selectedItem.id, { color: e.target.value });
      setColor(e.target.value); // Update local state if needed, though selectedItem.color should be source of truth
  };
  // --- END: Wrap panel updates ---


  // Room size change (doesn't affect gizmo)
  const handleRoomSizeChange = (e, dimension) => {
    const value = e.target.value;
    if (value === '') {
      setRoomSize({ ...roomSize, [dimension]: value });
    } else {
      setRoomSize({ ...roomSize, [dimension]: parseFloat(value) || 0 });
    }
  };

  // Fetch local color when selection changes
  useEffect(() => {
    if (selectedItem?.color) {
      setColor(selectedItem.color);
    } else {
      setColor('#cccccc'); // Default if no item or item has no color
    }
  }, [selectedItem]);


  return (
    <div className="controls-panel">
      <h2>Room Controls</h2>
      {/* ... room controls like Show Dimensions ... */}

      <h2>Furniture</h2>
      <div className="button-group">
        {models.map((model) => (
           <div key={model.name} style={{ display: 'inline-block', margin: 8, textAlign: 'center'}}>
             <div>{model.name}</div>
             <img src={model.image} alt={model.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee', marginBottom: 4 }} />
             <button onClick={() => addFurniture(model.name)} style={{fontSize: '0.8em', padding: '4px 8px'}}>Add</button>
           </div>
        ))}
      </div>

      {selectedItem && (
        <div className="selected-item-controls">
          <h3>Selected Item: {selectedItem.type}</h3>

          {/* --- START: Gizmo Mode Buttons --- */}
           <div className="control-group" style={{ marginBottom: '15px' }}>
             <label style={{fontWeight: 'bold', marginBottom: '5px', display: 'block'}}>Gizmo Mode:</label>
             <div style={{display: 'flex', gap: '5px'}}>
                 <button onClick={() => setGizmoMode('translate')} style={gizmoMode === 'translate' ? activeButtonStyle : buttonStyle}>Translate</button>
                 <button onClick={() => setGizmoMode('rotate')} style={gizmoMode === 'rotate' ? activeButtonStyle : buttonStyle}>Rotate</button>
                 <button onClick={() => setGizmoMode('scale')} style={gizmoMode === 'scale' ? activeButtonStyle : buttonStyle}>Scale</button>
             </div>
           </div>
          {/* --- END: Gizmo Mode Buttons --- */}

          <div className="control-group">
            <label>Color:</label>
            <input
              type="color"
              value={selectedItem.color || '#cccccc'} // Use selectedItem color directly
              onChange={handlePanelColorChange} // Use specific handler
              onFocus={onPanelInteraction} // Also disable gizmo on focus
            />
          </div>
          <div className="control-group">
            <label>X Position:</label>
            <input
                type="number"
                value={selectedItem.position.x.toFixed(2)} // Format for display
                onChange={(e) => handlePanelPositionChange('x', e.target.value)}
                step={0.1}
                onFocus={onPanelInteraction} // Disable gizmo on focus
            />
          </div>
          <div className="control-group">
            <label>Z Position:</label>
            <input
                type="number"
                value={selectedItem.position.z.toFixed(2)} // Format for display
                onChange={(e) => handlePanelPositionChange('z', e.target.value)}
                step={0.1}
                onFocus={onPanelInteraction} // Disable gizmo on focus
            />
          </div>
          <div className="control-group">
            <label>Rotation (Y-axis): {Math.round(selectedItem.rotation * (180 / Math.PI))}°</label>
            <input
                type="range"
                min="0"
                max="360"
                // Convert radians back to degrees for slider
                value={selectedItem.rotation * (180/Math.PI)}
                onChange={(e) => handlePanelRotationChange(e.target.value)}
                step={1} // Finer control maybe?
                onMouseDown={onPanelInteraction} // Disable gizmo when starting slider drag
            />
          </div>
          <button
            className="delete-button"
            onClick={() => deleteFurniture(selectedItem.id)}
          >
            Delete Item
          </button>
        </div>
      )}
    </div>
  );
}

// --- START: Button Styles for Gizmo Mode ---
const buttonStyle = {
    padding: '6px 10px',
    fontSize: '0.85em',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer'
};

const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#e0e0ff', // Highlight active button
    borderColor: '#a0a0ff',
    fontWeight: 'bold'
};
// --- END: Button Styles for Gizmo Mode ---