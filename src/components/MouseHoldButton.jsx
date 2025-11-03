import React, { useState, useRef, useEffect } from 'react';

function MouseHoldButton() {
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef(null);

  const handleMouseDown = () => {
    setIsHolding(true);
    timerRef.current = setTimeout(() => {
      console.log('Mouse is being held!');
    }, 500);
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    clearTimeout(timerRef.current);
  };

  const handleMouseLeave = () => {
    if (isHolding) {
      setIsHolding(false);
      clearTimeout(timerRef.current);
    }
  };

  useEffect(() => {
      clearTimeout(timerRef.current);
  }, []);

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
    >
      {isHolding ? 'Holding...' : 'Hold Me'}
    </button>
  );
}

export default MouseHoldButton;