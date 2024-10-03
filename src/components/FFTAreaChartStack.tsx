import  { useState, useCallback, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import CustomizedGradient from '../common/CustomizedGradient';
// Configuration object
const config = {
  NUM_CHARTS: 24,
  POINTS_PER_CHART: 512,
  MAX_Y_VALUE: 90,
  CHART_WIDTH: 900,
  CHART_HEIGHT: 150,
  CHART_OFFSET_X: 2,
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

// Data generation function
const generateSyntheticData = () => {
  const data = [];

  for (let i = 0; i < config.NUM_CHARTS; i++) {
    const currentDate = new Date(config.START_DATE);
    currentDate.setDate(config.START_DATE.getDate() + i);

    const timePoint = {
      name: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }),
      data: []
    };

    const faultProgression = 0.1 * i / (config.NUM_CHARTS - 1);

    for (let j = 0; j < config.POINTS_PER_CHART; j++) {
      const frequency = j * (1000 / config.POINTS_PER_CHART);
      let amplitude = 0.5;

      config.HARMONICS.forEach(harmonic => {
        const peakFreq = config.BASE_FREQUENCY * harmonic;
        const distance = Math.abs(frequency - peakFreq);
        amplitude += Math.exp(-distance * distance / 80) * (50 + 400 * faultProgression);
      });

      amplitude += Math.random() * 10;

      timePoint.data.push({
        frequency,
        amplitude: Math.min(amplitude, config.MAX_Y_VALUE)
      });
    }

    data.push(timePoint);
  }

  return data;
};

// Main FFTAreaChartStack component
const FFTAreaChartStack = () => {
  const syntheticData = useMemo(() => generateSyntheticData(), []);
  const [selectedCharts, setSelectedCharts] = useState([]);
  const [hoveredChart, setHoveredChart] = useState(null);
  const [hoveredFrequency, setHoveredFrequency] = useState(null);

  const handleMarkerClick = useCallback((index) => {
    setSelectedCharts(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else if (prev.length < 3) {
        return [...prev, index].sort((a, b) => a - b);
      }
      return prev;
    });
  }, []);

  const handleMarkerHover = useCallback((index) => {
    setHoveredChart(index);
  }, []);

  const handleMarkerLeave = useCallback(() => {
    setHoveredChart(null);
  }, []);

  const isChartVisible = useCallback((index) => {
    if (selectedCharts.includes(index)) {
      return true; // Always keep selected charts visible
    }
    if (hoveredChart !== null) {
      return index === hoveredChart;
    }
    if (selectedCharts.length > 0) {
      return false; // Fade non-selected charts when there are selections
    }
    return true; // By default, all charts are visible
  }, [selectedCharts, hoveredChart]);

  const findNearestPoint = useCallback((activeLabel, chartData) => {
    return chartData.reduce((nearest, point) => {
      return Math.abs(point.frequency - activeLabel) < Math.abs(nearest.frequency - activeLabel) ? point : nearest;
    });
  }, []);

  const getColorForValue = useCallback((value) => {
    const normalizedValue = value / config.MAX_Y_VALUE;
    for (let i = 1; i < config.GRADIENT_STOPS.length; i++) {
      if (normalizedValue <= config.GRADIENT_STOPS[i].offset) {
        const prevStop = config.GRADIENT_STOPS[i - 1];
        const currStop = config.GRADIENT_STOPS[i];
        const t = (normalizedValue - prevStop.offset) / (currStop.offset - prevStop.offset);
        const r = Math.round(parseInt(prevStop.color.slice(1, 3), 16) * (1 - t) + parseInt(currStop.color.slice(1, 3), 16) * t);
        const g = Math.round(parseInt(prevStop.color.slice(3, 5), 16) * (1 - t) + parseInt(currStop.color.slice(3, 5), 16) * t);
        const b = Math.round(parseInt(prevStop.color.slice(5, 7), 16) * (1 - t) + parseInt(currStop.color.slice(5, 7), 16) * t);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }
    }
    return config.GRADIENT_STOPS[config.GRADIENT_STOPS.length - 1].color;
  }, []);

  const CustomTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const relevantCharts = selectedCharts.length > 0 ? selectedCharts : [hoveredChart];
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: '#f9f9f9',
          padding: '8px 16px',
          borderRadius: '12px',
          position: 'absolute',
          bottom: `${config.CHART_HEIGHT}px`,
          left: '100px',
          zIndex: 1000,
        }}>
          <p>{`Frequency: ${Math.round(label)} Hz`}</p>
          {relevantCharts.map((chartIndex) => {
            const chartData = syntheticData[chartIndex].data;
            const nearestPoint = findNearestPoint(label, chartData);
            const color = getColorForValue(nearestPoint.amplitude);
            return (
              <p key={chartIndex} style={{ color: color, fontWeight: 'bold' }}>
                {`${syntheticData[chartIndex].name}: ${nearestPoint.amplitude.toFixed(2)}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  }, [selectedCharts, hoveredChart, syntheticData, findNearestPoint, getColorForValue]);

  const getChartStyle = useCallback((index) => {
    const isVisible = isChartVisible(index);
    return {
      position: 'absolute',
      top: `${index * config.CHART_OFFSET_Y}px`,
      left: `${index * config.CHART_OFFSET_X}px`,
      zIndex: isVisible ? config.NUM_CHARTS + 1 - index : config.NUM_CHARTS - index,
      width: `${config.CHART_WIDTH + config.NAME_OFFSET}px`,
      height: `${config.CHART_HEIGHT}px`,
      transition: 'opacity 0.07s ease-in-out',
      opacity: isVisible ? 1 : 0.09,
      pointerEvents: 'auto',
    };
  }, [isChartVisible]);

  const memoizedCharts = useMemo(() => (
    syntheticData.map((series, index) => {
      const maxValue = Math.max(...series.data.map(d => d.amplitude));
      const gradientId = `gradient-${index}`;
      const isFrontmostSelected = selectedCharts.length > 0 && index === selectedCharts[0];
      
      return (
        <div key={index} style={getChartStyle(index)}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={series.data}
              margin={{ top: 10, right: 50 + config.NAME_OFFSET, left: 0, bottom: 0 }}
              syncId="anyId"
              onMouseMove={(e) => {
                if (e && e.activeLabel) {
                  setHoveredFrequency(Math.round(parseFloat(e.activeLabel)));
                }
              }}
            >
              <defs>
                <CustomizedGradient id={gradientId} maxValue={maxValue} />
              </defs>
              <XAxis 
                dataKey="frequency" 
                type="number"
                domain={[0, 1000]}
                tick={index === 0}
                axisLine={{ stroke: '#d3d3d3' }}
                label={index === 0 ? { value: 'Frequency (Hz)', position: 'bottom' } : null}
                ticks={config.USE_HARMONIC_X_AXIS ? 
                  config.HARMONICS.map(h => h * config.BASE_FREQUENCY) : 
                  [...Array(Math.floor(1000 / config.X_AXIS_INTERVAL) + 1)].map((_, i) => i * config.X_AXIS_INTERVAL)}
              />
              <YAxis 
                domain={[0, config.MAX_Y_VALUE]} 
                tick={index === 0}
                axisLine={{ stroke: '#d3d3d3' }}
                label={index === 0 ? { value: 'Amplitude', angle: -90, position: 'insideLeft' } : null}
              />
              <Tooltip 
                content={isFrontmostSelected ? <CustomTooltip /> : <></>}
                cursor={{ stroke: '#212121', strokeWidth: 1 }}
                allowEscapeViewBox={{ x: false, y: true }}
                animationDuration="150"
                offset={25}
                animationEasing="ease-in-out"
              />
              <Area 
                type="monotone" 
                dataKey="amplitude" 
                stroke={`url(#${gradientId})`} 
                fill={`url(#${gradientId})`} 
                fillOpacity={0.56}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: 'red' }}
              />
              {/* Marker */}
              <g 
                className="marker-region"
                onClick={() => handleMarkerClick(index)}
                onMouseEnter={() => handleMarkerHover(index)}
                onMouseLeave={handleMarkerLeave}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={config.CHART_WIDTH + 7}
                  cy={config.CHART_HEIGHT - 20}
                  r={config.MARKER_SIZE}
                  fill={selectedCharts.includes(index) ? "red" : "#888"}
                />
                <rect 
                  x={config.CHART_WIDTH}
                  y={config.CHART_HEIGHT - 40}
                  width={40}
                  height={40}
                  fill="transparent"
                />
              </g>
              {/* Chart name */}
              {(index % config.DATE_GAP === 0 || index === 0) && (
                <text
                  x={config.CHART_WIDTH + 20}
                  y={config.CHART_HEIGHT - 30}
                  textAnchor="start"
                  fill="#333"
                  fontSize="12"
                  alignmentBaseline="middle"
                >
                  {series.name}
                </text>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );
    })
  ), [syntheticData, getChartStyle, selectedCharts, hoveredChart, handleMarkerClick, handleMarkerHover, handleMarkerLeave, CustomTooltip]);

  const clearSelection = () => {
    setSelectedCharts([]);
  };

  return (
    <div style={{
      width: '100%',
      height: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
    }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          position: 'relative',
          width: `${config.CHART_WIDTH + (config.NUM_CHARTS - 1) * config.CHART_OFFSET_X + config.NAME_OFFSET}px`,
          height: `${config.CHART_HEIGHT + (config.NUM_CHARTS - 1) * config.CHART_OFFSET_Y}px`,
        }}>
          {memoizedCharts}
        </div>
      </div>
      
    </div>
  );
};

export default FFTAreaChartStack;