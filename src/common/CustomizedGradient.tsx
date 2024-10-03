
import React from "react";

const config = {
    NUM_CHARTS: 32,
    POINTS_PER_CHART: 256,
    MAX_Y_VALUE: 90,
    CHART_WIDTH: 600,
    CHART_HEIGHT: 200,
    CHART_OFFSET_X: 3,
    CHART_OFFSET_Y: -5,
    MARKER_SIZE: 4,
    NAME_OFFSET: 10,
    DATE_GAP: 4,
    BASE_FREQUENCY: 35,
    HARMONICS: [1, 3, 7, 14, 20],
    START_DATE: new Date('2023-05-01'),
    GRADIENT_STOPS: [
      { offset: 0, color: '#00158c' },
      { offset: 0.2, color: '#0000ff' },
      { offset: 0.45, color: '#00ff00' },
      { offset: 0.65, color: '#ffff00' },
      { offset: 0.85, color: '#ffa500' },
      { offset: 1, color: '#ff0000' },
    ],
    USE_HARMONIC_X_AXIS: false,
    X_AXIS_INTERVAL: 100,
  };

  
const CustomizedGradient = React.memo(({ id, maxValue }) => {
    const normalizedMax = maxValue / config.MAX_Y_VALUE;
    return (
      <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
        {config.GRADIENT_STOPS.map((stop, index) => {
          if (stop.offset <= normalizedMax) {
            return <stop offset={`${(stop.offset / normalizedMax) * 100}%`} stopColor={stop.color} key={index} />;
          } else if (index > 0 && config.GRADIENT_STOPS[index - 1].offset < normalizedMax) {
            const prevStop = config.GRADIENT_STOPS[index - 1];
            const t = (normalizedMax - prevStop.offset) / (stop.offset - prevStop.offset);
            const r = Math.round(parseInt(prevStop.color.slice(1, 3), 16) * (1 - t) + parseInt(stop.color.slice(1, 3), 16) * t);
            const g = Math.round(parseInt(prevStop.color.slice(3, 5), 16) * (1 - t) + parseInt(stop.color.slice(3, 5), 16) * t);
            const b = Math.round(parseInt(prevStop.color.slice(5, 7), 16) * (1 - t) + parseInt(stop.color.slice(5, 7), 16) * t);
            const interpolatedColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            return <stop offset="100%" stopColor={interpolatedColor} key={index} />;
          }
          return null;
        })}
      </linearGradient>
    );
  });

  export default CustomizedGradient;