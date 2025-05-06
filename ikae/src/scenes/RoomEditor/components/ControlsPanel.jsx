import { useEffect, useState } from 'react';
import fetchModels from '../utils/fetchModels';

export default function ControlsPanel({
  roomSize,
  setRoomSize,
  selectedItem,
  updateFurniture,
  addFurniture,
  deleteFurniture,
  showDimensions,
  setShowDimensions,
  onPanelInteraction, // Function to disable gizmo
  gizmoMode,
  setGizmoMode,
  // --- Receive setIsGizmoActive ---
  setIsGizmoActive
}) {
  const [color, setColor] = useState('#cccccc');
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetchModels().then(setModels);
  }, []);

  // --- Wrap panel updates with onPanelInteraction ---
  const handlePanelUpdate = (id, updates) => {
    onPanelInteraction();
    updateFurniture(id, updates);
  };

  const handlePanelPositionChange = (axis, value) => {
    if (!selectedItem) return;
    onPanelInteraction();
    const newPosition = { ...selectedItem.position };
    newPosition[axis] = Number(value);
    updateFurniture(selectedItem.id, { position: newPosition });
  };

   const handlePanelRotationChange = (value) => {
      if (!selectedItem) return;
      onPanelInteraction();
      updateFurniture(selectedItem.id, { rotation: Number(value) * (Math.PI / 180) });
   };

  const handlePanelColorChange = (e) => {
      if (!selectedItem) return;
      onPanelInteraction();
      // updateFurniture(selectedItem.id, { color: e.target.value }); // Let updateFurniture handle it if needed centrally
      setColor(e.target.value); // Update local preview if necessary
      // Trigger central update specifically for color if ControlsPanel manages it
      updateFurniture(selectedItem.id, { color: e.target.value });
  };
  // --- END Wrap panel updates ---


  const handleRoomSizeChange = (e, dimension) => {
    const value = e.target.value;
    if (value === '') {
      setRoomSize({ ...roomSize, [dimension]: value });
    } else {
      setRoomSize({ ...roomSize, [dimension]: parseFloat(value) || 0 });
    }
  };

  useEffect(() => {
    if (selectedItem?.color) {
      setColor(selectedItem.color);
    } else {
      setColor('#cccccc');
    }
  }, [selectedItem]);

  // --- Add Handler to re-enable gizmo ---
  const handleRotationSliderRelease = () => {
      if (selectedItem) {
          setIsGizmoActive(true);
      }
  };
  // --- End Handler ---


  return (
    <div className="controls-panel">
      <h2>Room Controls</h2>
       <div className="control-group">
         <label className="flex items-center gap-2">
           <span className="select-none">Show Dimensions</span>
           <input
             type="checkbox"
             checked={showDimensions}
             onChange={(e) => setShowDimensions(e.target.checked)}
             className="form-checkbox h-4 w-4 text-blue-600" // Basic styling example
           />
         </label>
       </div>

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

           <div className="control-group" style={{ marginBottom: '15px' }}>
             <label style={{fontWeight: 'bold', marginBottom: '5px', display: 'block'}}>Gizmo Mode:</label>
             <div style={{display: 'flex', gap: '5px'}}>
                 <button onClick={() => setGizmoMode('translate')} style={gizmoMode === 'translate' ? activeButtonStyle : buttonStyle}>Translate</button>
                 <button onClick={() => setGizmoMode('rotate')} style={gizmoMode === 'rotate' ? activeButtonStyle : buttonStyle}>Rotate</button>
                 <button onClick={() => setGizmoMode('scale')} style={gizmoMode === 'scale' ? activeButtonStyle : buttonStyle}>Scale</button>
             </div>
           </div>

          <div className="control-group">
            <label>Color:</label>
            <input
              type="color"
              value={selectedItem.color || '#cccccc'}
              onChange={handlePanelColorChange}
              onFocus={onPanelInteraction}
            />
          </div>
          <div className="control-group">
            <label>X Position:</label>
            <input
                type="number"
                value={selectedItem.position.x.toFixed(2)}
                onChange={(e) => {
                  onPanelInteraction();
                  handlePanelPositionChange('x', e.target.value)
                }}
                step={0.1}
                onFocus={onPanelInteraction}
            />
          </div>
          <div className="control-group">
            <label>Z Position:</label>
            <input
                type="number"
                value={selectedItem.position.z.toFixed(2)}
                 onChange={(e) => {
                  onPanelInteraction();
                  handlePanelPositionChange('z', e.target.value)
                 }}
                step={0.1}
                onFocus={onPanelInteraction}
            />
          </div>
          <div className="control-group">
            <label>Rotation (Y-axis): {Math.round(selectedItem.rotation * (180 / Math.PI))}°</label>
            <input
                type="range"
                min="0"
                max="360"
                value={selectedItem.rotation * (180/Math.PI)}
                onChange={(e) => handlePanelRotationChange(e.target.value)}
                step={1}
                onMouseDown={onPanelInteraction}
                // --- Add MouseUp/TouchEnd ---
                onMouseUp={handleRotationSliderRelease}
                onTouchEnd={handleRotationSliderRelease}
                // --- End MouseUp/TouchEnd ---
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

// Button Styles
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
    backgroundColor: '#e0e0ff',
    borderColor: '#a0a0ff',
    fontWeight: 'bold'
};