import React, { useState, useEffect, useRef } from 'react';
import './Marquee.css';

const Marquee = ({ children, speed }) => {
  const containerRef = useRef(null);
  const [cloneWidth, setCloneWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const clone = container.querySelector('.clone');

    if (clone) {
      setCloneWidth(clone.offsetWidth);
    }
  }, [children]);

  return (
    <div className="marquee-container" ref={containerRef}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        <div className="marquee-content">{children}</div>
        <div className="marquee-content clone">{children}</div>
      </div>
    </div>
  );
};

export default Marquee;
