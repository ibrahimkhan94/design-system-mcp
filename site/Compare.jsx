import { useState } from 'react';
import BeforeScreen from '../samples/before.jsx';
import AfterScreen from '../samples/after.jsx';

// Drag the handle to wipe between the two screens.
export default function Compare({ beforeScore, afterScore }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="compare-slider">
      <div className="compare-slider__labels">
        <span className="chip chip--danger">Without Lumen · {beforeScore}%</span>
        <span className="chip chip--success">With Lumen · {afterScore}%</span>
      </div>
      <div className="compare-slider__frame" style={{ '--pos': `${pos}%` }}>
        <div className="compare-slider__layer compare-slider__after">
          <div className="compare-slider__screen"><AfterScreen /></div>
        </div>
        <div className="compare-slider__layer compare-slider__before screen--before">
          <div className="compare-slider__screen"><BeforeScreen /></div>
        </div>
        <div className="compare-slider__handle" aria-hidden="true"><span>⟷</span></div>
        <input
          type="range"
          min="0"
          max="100"
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Drag to compare the screen built without Lumen and with Lumen"
        />
      </div>
      <p className="compare-slider__hint">Drag to compare</p>
    </div>
  );
}
