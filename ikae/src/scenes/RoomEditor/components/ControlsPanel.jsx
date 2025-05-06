// components/ControlsPanel.jsx
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
  vertexes,
  setVertexes,
  furniture,
  setFurniture
}) {
  const [color, setColor] = useState('#cccccc');
  const [models, setModels] = useState([]);
  const [designName, setDesignName] = useState('');
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    fetchModels().then(setModels);
    setSavedDesigns(getSavedDesignNames());
  }, []);

  const handleRoomSizeChange = (e, dimension) => {
    const value = e.target.value;
    if (value === '') {
      setRoomSize({
        ...roomSize,
        [dimension]: value
      });
    } else {
      setRoomSize({
        ...roomSize,
        [dimension]: parseFloat(value) || 0
      });
    }
  };

  const handleFurnitureUpdate = (e, property) => {
    if (!selectedItem) return;
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    updateFurniture(selectedItem.id, { [property]: value });
  };

  // --- Save/Load helpers ---
  function saveDesign(name, vertexes, furniture) {
    const data = {
      vertexes,
      furniture: furniture.map(item => ({
        ...item,
        position: item.position,
        rotation: item.rotation,
        type: item.type,
        color: item.color,
        dimensions: item.dimensions,
        glb: item.glb,
        image: item.image,
        id: item.id,
      })),
    };
    localStorage.setItem(`roomDesign:${name}`, JSON.stringify(data));
  }

  function loadDesign(name) {
    const data = localStorage.getItem(`roomDesign:${name}`);
    if (!data) return null;
    return JSON.parse(data);
  }

  function getSavedDesignNames() {
    return Object.keys(localStorage)
      .filter(key => key.startsWith('roomDesign:'))
      .map(key => key.replace('roomDesign:', ''));
  }

  function handleSave() {
    if (!designName) return;
    saveDesign(designName, vertexes, furniture);
    setSavedDesigns(getSavedDesignNames());
  }

  function handleLoad(name) {
    const data = loadDesign(name);
    if (!data) {
      setLoadError('Design not found or corrupted.');
      return;
    }
    setVertexes(data.vertexes);
    if (typeof setFurniture === 'function') setFurniture(data.furniture);
    setLoadError('');
  }

  return (
    <div className="controls-panel">
      {/* --- Save/Load UI --- */}
      <div style={{ marginBottom: 16, background: '#f9f9f9', padding: 8, borderRadius: 8 }}>
        <div style={{ marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Design name"
            value={designName}
            onChange={e => setDesignName(e.target.value)}
            style={{ width: '70%', marginRight: 8 }}
          />
          <div className="button-group">
            <button onClick={handleSave} style={{ padding: '2px 8px' }}>Save</button>
          </div>
          
        </div>
        <div>
          <strong>Saved Designs:</strong>
          <ul style={{ maxHeight: 100, overflowY: 'auto', margin: 0, padding: 0 }}>
            {savedDesigns.map(name => (
              <li key={name} style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <button
                  style={{ marginRight: 8, padding: '2px 8px' }}
                  onClick={() => handleLoad(name)}
                >
                  Load
                </button>
                <span>{name}</span>
              </li>
            ))}
          </ul>
          {loadError && <div style={{ color: 'red', fontSize: 12 }}>{loadError}</div>}
        </div>
      </div>

      <h2>Room Controls</h2>

      <div className="control-group">
        <label className="flex items-center gap-2">
          <span className="select-none">Show Dimensions</span>
          <input
            type="checkbox"
            checked={showDimensions}
            onChange={(e) => setShowDimensions(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
        </label>
      </div>

      <h2>Furniture</h2>
      <div className="button-group">
        {models.map((model) => (
          <div key={model.name} style={{ display: 'inline-block', margin: 8}}>
            <div>{model.name}</div>
            <img src={model.image} alt={model.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
            
            <button onClick={() => addFurniture(model.name)}>Add</button>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="selected-item-controls">
          <h3>Selected Item: {selectedItem.type}</h3>
          <div className="control-group">
            <label>Color:</label>
            <input 
              type="color" 
              value={selectedItem.color} 
              onChange={(e) => handleFurnitureUpdate(e, 'color')} 
            />
          </div>
          <div className="control-group">
            <label>X Position:</label>
            <input
                type="number"
                value={selectedItem.position.x}
                onChange={(e) => updateFurniture(selectedItem.id, {
                    position: { ...selectedItem.position, x: Number(e.target.value) }
                })}
                step={0.1}
            />
          </div>
          <div className="control-group">
            <label>Z Position:</label>
            <input
                type="number"
                value={selectedItem.position.z}
                onChange={(e) => updateFurniture(selectedItem.id, {
                    position: { ...selectedItem.position, z: Number(e.target.value) }
                })}
                step={0.1}
            />
          </div>
          <div className="control-group">
            <label>Rotation:</label>
            <input
                type="range"
                min="0"
                max="360"
                value={selectedItem.rotation * (180/Math.PI)}
                onChange={(e) => updateFurniture(selectedItem.id, {
                rotation: Number(e.target.value) * (Math.PI/180)
                })}
                step={5}
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