// components/ViewToggle.jsx
export default function ViewToggle({ is3DView, setIs3DView }) {
    return (
      <div className="view-toggle">
        <button 
          onClick={() => setIs3DView(false)}
          className={!is3DView ? 'active' : ''}
        >
          2D View
        </button>
        <button 
          onClick={() => setIs3DView(true)}
          className={is3DView ? 'active' : ''}
        >
          3D View
        </button>
      </div>
    );
  }