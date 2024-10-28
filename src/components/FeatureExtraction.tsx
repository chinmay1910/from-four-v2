import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, Brush, AreaChart, Area, ComposedChart, Line } from 'recharts';
import { Card } from '../common/Card';
import { FiEye, FiEyeOff, FiUploadCloud } from "react-icons/fi";
import { Button } from '../common/Button';
import CustomLabel from '../common/CustomLabel';
import { scaleLog } from 'd3-scale';
import HarmonicsLabel from '../common/HarmonicsLabel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';
import QuantitySelector from '../common/QunatitySelector';
import { Input } from '../common/Input';
import { SelectNative } from '../common/SelectNative';
import * as d3 from 'd3';
import { Delete, FlipVertical2, FoldHorizontal, IndentIncrease, Scan, Settings2, Trash2 } from 'lucide-react';
import FLabel from './FLabel';
import { Checkbox } from '../common/Checkbox';
// Helper functions
const generateColor = (index: number) => {
  const hue = (index * 137.508) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

// Types
type Axis = 'x' | 'y' | 'z';
type VisibleAxes = Record<Axis, boolean>;
type Marker = {
  frequency: number;
  bandWidth: number;
  color: string;
  harmonics: number;
  subHarmonics: number;
  axis: Axis;
  name: string;
  visible: boolean;
  harmonicMarkers?: HarmonicMarker[];
  sideBands: {
    enabled: boolean;
    count: number;
    spacing: number;
    leftEnabled: boolean;
    rightEnabled: boolean;
  };
};
type HarmonicMarker = {
  frequency: number;
  bandWidth: number;
  isHarmonic: boolean;
  order?: string;
};
type DataPoint = {
  frequency: number;
  x: number;
  y: number;
  z: number;
};
type SteppedLineInput = {
  startFrequency: string;
  warningAmplitude: string;
  alertAmplitude: string;
};

// Constants
const AXIS_COLORS = {
  x: "#ffc6b7",
  y: "#fd8c73",
  z: "#e30613"
};
const ALERT_COLORS = {
  warning: "#FACC15",
  alert: "#E11D48"
};

// Components

const FeatureExtraction: React.FC = () => {
  // State
  const [data, setData] = useState<DataPoint[]>([]);
  const [baseFrequency, setBaseFrequency] = useState(100);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [colorIndex, setColorIndex] = useState(0);
  const [visibleAxes, setVisibleAxes] = useState<VisibleAxes>({ x: true, y: true, z: true });
  const [markerName, setMarkerName] = useState('');
  const [brushDomain, setBrushDomain] = useState<[number, number] | null>(null);
  const [markerOrder, setMarkerOrder] = useState<number[]>([]);
  const [steppedLineData, setSteppedLineData] = useState<{ warning: DataPoint[], alert: DataPoint[] }>({ warning: [], alert: [] });
  const [steppedLineInputs, setSteppedLineInputs] = useState<SteppedLineInput[]>([{ startFrequency: '', warningAmplitude: '', alertAmplitude: '' }]);
  const [domainType, setDomainType] = useState<'native' | 'order'>('native');
  const [analysisName, setAnalysisName] = useState('');
  const [yAxisScale, setYAxisScale] = useState<'linear' | 'log'>('linear');
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });
  const [hasGeneratedLineChart, setHasGeneratedLineChart] = useState(false);
  const [globalSideBandSettings, setGlobalSideBandSettings] = useState({
    enabled: false,
    count: 2,
    spacing: 10,
    leftEnabled: true,
    rightEnabled: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Memoized values
  const memoizedAxisData = useMemo(() => {
    if (data.length === 0) return { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
    const xMin = 0;
    const xMax = data[data.length - 1].frequency;
    const yValues = data.flatMap(d => [d.x, d.y, d.z].filter(v => v !== undefined));
    const yMin = Math.min(...yValues) * 1.1;
    const yMax = Math.max(...yValues) * 1.5;
    return { xMin, xMax, yMin, yMax };
  }, [data]);

  // Callbacks
  const toggleYAxisScale = useCallback(() => {
    setYAxisScale(prevScale => (prevScale === 'linear' ? 'log' : 'linear'));
  }, []);

  const handleSteppedLineInputChange = useCallback((index: number, field: keyof SteppedLineInput, value: string) => {
    setSteppedLineInputs(prev => {
      const newInputs = [...prev];
      newInputs[index][field] = value;
      return newInputs;
    });
  }, []);

  const addSteppedLineInput = useCallback(() => {
    setSteppedLineInputs(prev => [...prev, { startFrequency: '', warningAmplitude: '', alertAmplitude: '' }]);
  }, []);

  const generateSteppedLineData = useCallback(() => {
    const warningData: DataPoint[] = [];
    const alertData: DataPoint[] = [];

    // Sort inputs by frequency
    const sortedInputs = [...steppedLineInputs].sort((a, b) =>
      Number(a.startFrequency) - Number(b.startFrequency)
    );

    sortedInputs.forEach((input, i) => {
      const start = Number(input.startFrequency);
      const warningAmplitude = Number(input.warningAmplitude);
      const alertAmplitude = Number(input.alertAmplitude);
      const end = i < sortedInputs.length - 1 ? Number(sortedInputs[i + 1].startFrequency) : start + 1;

      warningData.push({ frequency: start, x: warningAmplitude, y: warningAmplitude, z: warningAmplitude });
      warningData.push({ frequency: end, x: warningAmplitude, y: warningAmplitude, z: warningAmplitude });

      alertData.push({ frequency: start, x: alertAmplitude, y: alertAmplitude, z: alertAmplitude });
      alertData.push({ frequency: end, x: alertAmplitude, y: alertAmplitude, z: alertAmplitude });
    });

    setSteppedLineData({ warning: warningData, alert: alertData });
    setHasGeneratedLineChart(true);
  }, [steppedLineInputs]);

  const handleChartClick = useCallback((event: any) => {
    if (!event || !event.activeLabel) return;

    const clickedFrequency = Math.round(Number(event.activeLabel));
    const activeDataKey = event.activeTooltipIndex !== undefined
      ? Object.keys(event.activePayload[0].payload).find(key => key !== 'frequency' && visibleAxes[key as Axis])
      : null;

    const newMarker: Marker = {
      frequency: clickedFrequency,
      bandWidth: 20,
      color: generateColor(colorIndex),
      harmonics: 0,
      subHarmonics: 0,
      axis: activeDataKey as Axis,
      name: markerName || `Marker ${markers.length + 1}`,
      visible: true,
      sideBands: {
        enabled: false,
        count: 2,
        spacing: 10,
        leftEnabled: true,
        rightEnabled: true,
      },
    };
    setMarkers(prev => [...prev, newMarker]);
    setMarkerOrder(prev => [...prev, markers.length]);
    setColorIndex(prev => prev + 1);
    setMarkerName('');
  }, [colorIndex, visibleAxes, markers.length, markerName]);

  const updateHarmonicMarkers = useCallback((marker: Marker): Marker => {
    const harmonicMarkers: HarmonicMarker[] = [
      ...Array(Number(marker.subHarmonics)).fill(null).map((_, i) => ({
        frequency: Math.round(marker.frequency / (i + 2)),
        bandWidth: marker.bandWidth,
        isHarmonic: true,
        order: `1/${i + 2}`
      })),
      ...Array(Number(marker.harmonics)).fill(null).map((_, i) => ({
        frequency: Math.round(marker.frequency * (i + 2)),
        bandWidth: marker.bandWidth,
        isHarmonic: true
      }))
    ];
    // Add side bands
    if (marker.sideBands.enabled) {
      for (let i = 1; i <= marker.sideBands.count; i++) {
        if (marker.sideBands.leftEnabled) {
          harmonicMarkers.push({
            frequency: marker.frequency - i * marker.sideBands.spacing,
            bandWidth: marker.bandWidth,
            isHarmonic: false,
            isSideBand: true,
            side: 'left'
          });
        }
        if (marker.sideBands.rightEnabled) {
          harmonicMarkers.push({
            frequency: marker.frequency + i * marker.sideBands.spacing,
            bandWidth: marker.bandWidth,
            isHarmonic: false,
            isSideBand: true,
            side: 'right'
          });
        }
      }
    }
    return { ...marker, harmonicMarkers };
  }, []);

  const handleMarkerChange = useCallback((index: number, field: keyof Marker, value: any) => {
    setMarkers(prev => {
      const updatedMarkers = prev.map((marker, i) => {
        if (i !== index) return marker;
        let updatedMarker = { ...marker, [field]: field === 'frequency' ? Math.round(Number(value)) : value };
        if (field.startsWith('sideBands.')) {
          const sideBandField = field.split('.')[1] as keyof Marker['sideBands'];
          updatedMarker = {
            ...updatedMarker,
            sideBands: {
              ...updatedMarker.sideBands,
              [sideBandField]: value
            }
          };
        }
        return updateHarmonicMarkers(updatedMarker);
      });
      return updatedMarkers;
    });
  }, [updateHarmonicMarkers]);

  const handleRemoveMarker = useCallback((index: number) => {
    setMarkers(prev => {
      const newMarkers = [...prev];
      newMarkers.splice(index, 1);
      return newMarkers;
    });
    setMarkerOrder(prev => {
      const newOrder = prev.filter(i => i !== index).map(i => i > index ? i - 1 : i);
      return newOrder;
    });
  }, []);

  const toggleMarkerVisibility = useCallback((index: number) => {
    setMarkers(prev => prev.map((marker, i) =>
      i === index ? { ...marker, visible: !marker.visible } : marker
    ));
  }, []);

  const handleBrush = useCallback((brushArea: { startIndex: number; endIndex: number; } | null) => {
    if (brushArea) {
      const startFrequency = data[brushArea.startIndex]?.frequency;
      const endFrequency = data[brushArea.endIndex]?.frequency;
      setBrushDomain([startFrequency, endFrequency]);
    } else {
      setBrushDomain(null);
    }
  }, [data]);


  const isFullRange = useMemo(() => {
    if (!brushDomain || data.length === 0) return true;
    const [start, end] = brushDomain;
    const dataStart = data[0].frequency;
    const dataEnd = data[data.length - 1].frequency;
    return start <= dataStart && end >= dataEnd;
  }, [brushDomain, data]);

  const getYAxisProps = useCallback(() => {
    if (yAxisScale === 'log') {
      const yMin = Math.max(memoizedAxisData.yMin, 0.0001);
      const yMax = memoizedAxisData.yMax;
      return {
        scale: scaleLog().base(Math.E),
        domain: [yMin, yMax],
        tickFormatter: (value: number) => value.toExponential(2),
      };
    } else {
      return {
        domain: [memoizedAxisData.yMin, memoizedAxisData.yMax],
        tickFormatter: (value: number) => value.toFixed(2),
      };
    }
  }, [yAxisScale, memoizedAxisData]);

  const getXAxisProps = useCallback(() => {
    const props = {
      dataKey: "frequency",
      type: "number",
      minTickGap: domainType === 'native' ? 20 : 10,
      tickCount: domainType === 'native' ? 34 : 22,
      domain: brushDomain || [memoizedAxisData.xMin, memoizedAxisData.xMax],
      tickFormatter: (value: number) => domainType === 'native' ? value : (value / baseFrequency).toFixed(1) + 'x',
    };
    return props;
  }, [domainType, brushDomain, memoizedAxisData, baseFrequency]);

  const customTooltip = useCallback(({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const frequency = Number(label);
      const order = frequency / baseFrequency;
      return (
        <div className="bg-slate-900 p-5 text-slate-50 rounded-md shadow">
          <p className='font-bold text-amber-300 line-height-0'>
            Freq: {frequency.toFixed(0)} Hz
          </p>
          <p className='font-bold text-teal-400'>
            Order: x{order.toFixed(2)}
          </p>
          <hr className='my-1 border border-slate-800'></hr>
          {payload.map((entry: any, index: number) => (
            <p key={index}>{entry.name.replace('-Axis', ' ')}: {entry.value ? entry.value.toFixed(2) : 'N/A'} mg</p>
          ))}
        </div>
      );
    }
    return null;
  }, [baseFrequency]);

  const memoizedMarkerElements = useMemo(() => markers.flatMap((marker, index) => {
    if (!marker.visible) return [];

    const elements = [
      <ReferenceLine
        key={`line-${index}`}
        x={marker.frequency}
        stroke={marker.color}
        label={<CustomLabel value={`${marker.name}`} viewBox={undefined} />}
        strokeDasharray="7 3"
        strokeOpacity={0.75}
      />,
      <ReferenceArea
        key={`area-${index}`}
        x1={marker.frequency - marker.bandWidth / 2}
        x2={marker.frequency + marker.bandWidth / 2}
        y1={memoizedAxisData.yMin}
        y2={memoizedAxisData.yMax / 1.4}
        fill={marker.color}
        fillOpacity={0.2}
        strokeOpacity={0.3}
      />
    ];

    if (marker.harmonicMarkers) {
      marker.harmonicMarkers.forEach((harmonic, hIndex) => {
        elements.push(
          <ReferenceLine
            key={`harmonic-line-${index}-${hIndex}`}
            x={harmonic.frequency}
            stroke={marker.color}
            strokeDasharray="7 3"
            strokeOpacity={0.6}
            label={<HarmonicsLabel value={`${harmonic.frequency} Hz`} viewBox={undefined} />}
          />,
          <ReferenceArea
            key={`harmonic-area-${index}-${hIndex}`}
            x1={harmonic.frequency - harmonic.bandWidth / 2}
            x2={harmonic.frequency + harmonic.bandWidth / 2}
            y1={memoizedAxisData.yMin}
            y2={memoizedAxisData.yMax / 1.4}
            fill={marker.color}
            fillOpacity={0.1}
            strokeOpacity={0.2}
          />
        );
      });
    }

    return elements;
  }), [markers, memoizedAxisData]);

  const toggleAxisVisibility = useCallback((axis: Axis) => {
    setVisibleAxes(prev => ({ ...prev, [axis]: !prev[axis] }));
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        const parsedData = lines
          .filter(line => line.trim() !== '')
          .map((line, index) => {
            const [x, y, z] = line.split(/\s+/).map(value => {
              const num = Number(value);
              return num === 0 ? 0.0001 : num;
            });
            return { frequency: index, x, y, z };
          });
        setData(parsedData);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const domainOptions = [
    { value: 'native', label: 'Frequency' },
    { value: 'order', label: 'Order' }
  ] as const;

  const axisOptions = [
    { value: 'x', label: 'X' },
    { value: 'y', label: 'Y' },
    { value: 'z', label: 'Z' }
  ] as const;

  // Add this function to generate line data
  const generateLineData = useCallback(() => {
    const warningData = steppedLineData.warning.map(d => ({ frequency: d.frequency, value: d.x }));
    const alertData = steppedLineData.alert.map(d => ({ frequency: d.frequency, value: d.x }));
    return { warningData, alertData };
  }, [steppedLineData]);

  // Get line data
  const { warningData, alertData } = useMemo(() => generateLineData(), [generateLineData]);

  useEffect(() => {
    console.log('Stepped line data:', steppedLineData);
    console.log('Main chart data:', data);
  }, [steppedLineData, data]);

  // Add this new function after other callbacks
  const exportMarkersToCSV = useCallback(() => {
    // Create CSV header
    const headers = [
      'Name',
      'Order',
      'Frequency (Hz)',
      'Band Size (Hz)',
      'Harmonics',
      'Sub-Harmonics',
      'Axis',
      'Side Bands',
      'Count',
      'Spacing',
      'Left/Right'
    ];
    
    // Convert markers data to CSV rows
    const csvData = markerOrder.map(orderIndex => {
      const marker = markers[orderIndex];
      const leftRight = [
        marker.sideBands.leftEnabled ? 'L' : '',
        marker.sideBands.rightEnabled ? 'R' : ''
      ].filter(Boolean).join('/');
      
      return [
        marker.name,
        (marker.frequency / baseFrequency).toFixed(2),
        marker.frequency,
        marker.bandWidth,
        marker.harmonics,
        marker.subHarmonics,
        marker.axis.toUpperCase() + '-Axis',
        marker.sideBands.enabled ? 'Yes' : 'No',
        marker.sideBands.count,
        marker.sideBands.spacing,
        leftRight
      ].join(',');
    });

    // Combine headers and data
    const csvContent = [headers.join(','), ...csvData].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${analysisName || 'markers'}_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [markers, markerOrder, baseFrequency, analysisName]);

  // Update the importMarkersFromCSV function
  const importMarkersFromCSV = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const lines = content.split('\n').filter(line => line.trim() !== ''); // Filter empty lines
          const headers = lines[0].split(',');
          
          console.log('CSV Headers:', headers); // Debug log
          console.log('CSV Lines:', lines); // Debug log

          const importedMarkers: Marker[] = lines.slice(1).map((line, idx) => {
            const values = line.split(',').map(value => value.trim());
            console.log(`Processing line ${idx + 1}:`, values); // Debug log
            
            const marker: Marker = {
              name: values[0], // Name
              frequency: Math.round(Number(values[2])), // Frequency (Hz)
              bandWidth: Number(values[3]), // Band Size (Hz)
              harmonics: Number(values[4]), // Harmonics
              subHarmonics: Number(values[5]), // Sub-Harmonics
              axis: values[6].split('-')[0].toLowerCase() as Axis, // Axis (X/Y/Z)
              color: generateColor(Math.random() * 360),
              visible: true,
              sideBands: {
                enabled: values[7].trim().toLowerCase() === 'yes', // Side Bands
                count: Number(values[8]), // Count
                spacing: Number(values[9]), // Spacing
                leftEnabled: values[10].includes('L'), // Left enabled
                rightEnabled: values[10].includes('R')  // Right enabled
              }
            };

            // Validate the marker data
            if (isNaN(marker.frequency) || isNaN(marker.bandWidth) || 
                isNaN(marker.harmonics) || isNaN(marker.subHarmonics)) {
              throw new Error(`Invalid numeric values in line ${idx + 1}: ${line}`);
            }

            return updateHarmonicMarkers(marker); // Important: Update harmonics before returning
          });

          console.log('Imported markers:', importedMarkers); // Debug log

          // Update state in a single batch
          setMarkers(importedMarkers);
          setMarkerOrder(Array.from({ length: importedMarkers.length }, (_, i) => i));
          
          // Reset the file input
          if (event.target) {
            event.target.value = '';
          }

        } catch (error) {
          console.error('Error importing markers:', error);
          alert(`Error importing markers: ${error.message}`);
        }
      };
      reader.readAsText(file);
    }
  }, [updateHarmonicMarkers]); // Add updateHarmonicMarkers to dependencies

  // Add this ref for the import input
  const importFileRef = useRef<HTMLInputElement>(null);

  // Add this debug useEffect
  useEffect(() => {
    console.log('Current markers:', markers);
    console.log('Current marker order:', markerOrder);
  }, [markers, markerOrder]);

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Card className="w-full mx-auto mt-4">
        <div className='flex justify-between items-center mb-7'>
          <h2 className='font-semibold text-lg ml-3 dark:text-slate-50'>Advanced Spectral Analysis<span className='text-slate-500 dark:text-slate-400 font-normal'>{analysisName && `- ${analysisName}`}</span></h2>

          <div className="inline-flex rounded-md shadow-sm">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setDomainType('native')}
                className={`px-4 py-2 text-sm font-medium border ${domainType === 'native'
                  ? 'bg-gray-200 text-slate-900 border-gray-200 hover:bg-gray-300 hover:text-slate-1000 dark:bg-slate-900 dark:text-slate-100 dark:border-none dark:hover:bg-slate-900 dark:hover:text-slate-50'
                  : 'bg-white text-slate-400 border-gray-200 hover:bg-gray-50 hover:text-gray-600 dark:bg-transparent dark:text-slate-400 dark:border-none dark:hover:bg-slate-900 dark:hover:text-slate-300'
              } rounded-l-lg`}


              >
                Frequency
              </button>
              <button
                type="button"
                onClick={() => setDomainType('order')}
                className={`px-4 py-2 text-sm font-medium border ${domainType === 'order'
                  ? 'bg-gray-200 text-slate-900 border-gray-200 hover:bg-gray-300 hover:text-slate-1000 dark:bg-slate-900 dark:text-slate-100 dark:border-none dark:hover:bg-slate-900 dark:hover:text-slate-50'
                  : 'bg-white text-slate-400 border-gray-200 hover:bg-gray-50 hover:text-gray-600 dark:bg-transparent dark:text-slate-400 dark:border-none dark:hover:bg-slate-900 dark:hover:text-slate-300'
              } rounded-r-lg`}
              >
                Order
              </button>
            </div>

            <div className='flex gap-5 ml-7'>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                {(['x', 'y', 'z'] as Axis[]).map((axis) => (
                  <button
                    key={axis}
                    type="button"
                    onClick={() => toggleAxisVisibility(axis)}
                    className={`px-4 py-2 text-sm font-medium border ${visibleAxes[axis]
                      ? 'bg-gray-200 text-slate-900 border-gray-200 hover:bg-gray-300 hover:text-slate-1000 dark:bg-slate-900 dark:text-slate-100 dark:border-none dark:hover:bg-slate-900 dark:hover:text-slate-50'
                      : 'bg-white text-slate-400 border-gray-200 hover:bg-gray-50 hover:text-gray-600 dark:bg-transparent dark:text-slate-400 dark:border-none dark:hover:bg-slate-900 dark:hover:text-slate-300'
                      } ${axis === 'x' ? 'rounded-l-lg' : axis === 'z' ? 'rounded-r-lg' : ''}`}
                  >
                    {axis.toUpperCase()}-Axis
                  </button>
                ))}
              </div>
            </div>
            <div className='divide-x-2 ml-7 mr-4'>
              <Button className='w-[60px]' variant='light' onClick={toggleYAxisScale}>
                {yAxisScale === 'log' ? 'Linear' : 'Log'}
              </Button>
            </div>
            <Button variant='light' onClick={handleUploadClick}>
              <p className='flex items-center gap-2'><FiUploadCloud />Upload File</p>
            </Button>
            <Button className="ml-4">
              Fetch Data
            </Button>
          </div>
        </div>

        <div ref={chartRef} style={{ height: '400px', width: '100%', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              onClick={handleChartClick}
            >
              <CartesianGrid vertical={false} horizontal={true} />
              <XAxis
                {...getXAxisProps()}
                domain={brushDomain || [memoizedAxisData.xMin, memoizedAxisData.xMax]}
                tick={{ fontSize: 10 }} // Equivalent to Tailwind's text-xs
                tickMargin={5}
              />
              <YAxis {...getYAxisProps()}
                tick={{ fontSize: 10 }} /> // Equivalent to Tailwind's text-xs
              <Tooltip
                content={customTooltip}
                allowEscapeViewBox={{ x: false, y: true }}
                animationDuration="150"
                offset={25}
                animationEasing="ease-in-out"
                cursor={{ strokeDasharray: '3 3' }}
              />
              {memoizedMarkerElements}

              {/* Main data series */}
              {(['x', 'y', 'z'] as Axis[]).map((axis) => (
                <Area
                  key={axis}
                  offset={25}
                  type="linear"
                  dataKey={axis}

                  fill={`${AXIS_COLORS[axis]}33`}
                  stroke={AXIS_COLORS[axis]}
                  strokeWidth={2}
                  dot={null}

                  name={`${axis.toUpperCase()}-Axis`}
                  isAnimationActive={false}
                  legendType="circle"
                  hide={!visibleAxes[axis]}
                />
              ))}

              {/* Conditional rendering of stepped lines */}
              {isFullRange && hasGeneratedLineChart && (
                <>
                  <Line
                    data={warningData}
                    type="stepAfter"
                    dataKey="value"
                    stroke={ALERT_COLORS.warning}
                    strokeWidth={1}
                    dot={false}
                    onClick={undefined}
                    isAnimationActive={false}
                    name="Warning Threshold"
                  />
                  <Line
                    data={alertData}
                    type="stepAfter"
                    dataKey="value"
                    stroke={ALERT_COLORS.alert}
                    strokeWidth={1}
                    dot={false}
                    isAnimationActive={false}
                    name="Alert Threshold"
                  />
                </>
              )}

              <Brush
                dataKey="frequency"
                height={40}
                stroke="#cccccc"
                travellerWidth={10}
                onChange={handleBrush}
              >
                <AreaChart data={data}>
                  <CartesianGrid vertical={false} horizontal={false} />
                  <YAxis hide domain={[memoizedAxisData.yMin, memoizedAxisData.yMax]} />
                  {(['x', 'y', 'z'] as Axis[]).map((axis) => (
                    <Area
                      key={axis}
                      type="linear"
                      dataKey={axis}
                      fill={`${AXIS_COLORS[axis]}00`}
                      stroke={AXIS_COLORS[axis]}
                      strokeWidth={1}
                      dot={null}
                      name={`${axis.toUpperCase()}-Axis`}
                      isAnimationActive={false}
                      legendType="circle"
                      hide={!visibleAxes[axis]}
                    />
                  ))}
                </AreaChart>
              </Brush>
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className='px-3 py-1 mt-8 '>
          <Tabs defaultValue="tab1">
            <div className='flex item-center place-items-center justify-between'>
              <div>
                <TabsList className='p-1.5' variant="solid">
                  <TabsTrigger className='text-base' value="tab1"><FoldHorizontal className="w-4 h-4 mr-2"></FoldHorizontal>Add Frequency Markers</TabsTrigger>
                  <TabsTrigger className='text-base' value="tab2"><IndentIncrease className="w-4 h-4 mr-2"></IndentIncrease>Add Thresholds</TabsTrigger>
                </TabsList>
              </div>

              <div className='flex justify-between items-center'>
                <div className="mb-4 flex space-x-4 items-center">
                  <div className="relative">

                    <input
                      type="number"
                      id="base-frequency"
                      value={baseFrequency}
                      onChange={(e) => setBaseFrequency(Math.round(Number(e.target.value)))}
                      className="relative block w-full appearance-none rounded-lg border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-950 disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:dark:border-gray-700 disabled:dark:bg-gray-800 disabled:dark:text-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 pt-4 pb-2.5 peer"
                      placeholder=" "
                    />
                    <label htmlFor="base-frequency" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-slate-600 dark:peer-focus:text-slate-300  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 dark:bg-slate-950 dark:text-slate-100">Base Freq (Hz)</label>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    accept=".csv,.txt"
                  />
                  <div className="relative">
                    {/* <FLabel
                      type="text"
                      id="analysis-name"
                      label='Analysis Name'

                      value={analysisName}
                      onChange={(e) => setAnalysisName(e.target.value)} placeholder=" " /> */}
                    {/* <FLabel id={"filtername"} label={"Filter Name"} onChange={(e) => setAnalysisName(e.target.map)} value={analysisName}
                      placeholder=" " /> */}
                    <input
                      type="text"
                      id="analysis-name"
                      maxLength={36}
                      value={analysisName}
                      onChange={(e) => setAnalysisName(e.target.value)}
                      className="relative block w-full appearance-none rounded-lg border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-950 disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:dark:border-gray-700 disabled:dark:bg-gray-800 disabled:dark:text-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 pt-4 pb-2.5 peer"
                      placeholder=" "
                    />
                    <label htmlFor="analysis-name"
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-slate-600 dark:peer-focus:text-slate-300  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 dark:bg-slate-950 dark:text-slate-100">Analysis Name</label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <TabsContent
                value="tab1"
                className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
              >
                <div>
                  <div className="overflow-y-auto mt-2 h-[260px] scrollbar">
                    <table className="w-full border-collapse">
                      <thead className='w-full'>
                        <tr className='bg-slate-50 rounded-lg dark:bg-slate-950'>
                          <th className="text-left p-2 pl-8 w-[200px] rounded-l-lg">Name</th>
                          <th className="text-left p-2 w-[60px]">Order</th>
                          <th className="text-left p-2 w-[140px]">Marker Name</th>
                          <th className="text-left p-2 w-[120px]">Freq (Hz)</th>
                          <th className="text-left p-2 w-[140px]">Band Size (Hz)</th>
                          <th className="text-left p-2 w-[100px]">Harmonics</th>
                          <th className="text-left p-2 w-[130px]">Sub-Harmonics</th>
                          <th className="text-left p-2 w-[120px]">Axis</th>
                          <th className="text-left p-2 w-[100px] dark:bg-slate-900 bg-neutral-100 pl-4 rounded-l-lg">Side Bands</th>
                          <th className="text-left p-2 w-[80px] dark:bg-slate-900 bg-neutral-100">Count</th>
                          <th className="text-left p-2 w-[80px] dark:bg-slate-900 bg-neutral-100">Spacing</th>
                          <th className="text-left p-2 w-[100px] dark:bg-slate-900 bg-neutral-100 rounded-r-lg">Left/Right</th>
                          <th className="text-right p-2 w-[160px]">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                onClick={exportMarkersToCSV}
                                className="flex items-center gap-2"
                              >
                                <FlipVertical2 className="w-4 h-4" />
                                Export
                              </Button>
                              <input
                                type="file"
                                id="csvFileInput"
                                onChange={importMarkersFromCSV}
                                style={{ display: 'none' }}
                                accept=".csv"
                              />
                              <Button 
                                variant="outline" 
                                onClick={() => document.getElementById('csvFileInput')?.click()}
                                className="flex items-center gap-2"
                              >
                                <Scan className="w-4 h-4" />
                                Import
                              </Button>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='mr-5'>
                        {markerOrder.map((orderIndex, index) => {
                          const marker = markers[orderIndex];
                          if (!marker) return null;
                          return (
                            <tr key={index}>
                              <td className="p-2">
                                <span style={{ borderLeftWidth: '4px', borderLeftColor: marker.color, opacity: 0.9 }} className='text-base pl-5 font-bold'>{marker.name}</span>
                              </td>
                              <td className="p-2">
                                <span className='text-base text-center font-medium'>{(marker.frequency / baseFrequency).toFixed(2)}x</span>
                              </td>
                              <td className="p-2">
                                <Input
                                  type="text"
                                  value={marker.name}

                                  maxLength={20}
                                  onChange={(e) => handleMarkerChange(orderIndex, 'name', e.target.value)}
                                  placeholder="Marker Name"
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  type="number"
                                  value={marker.frequency}
                                  onChange={(e) => handleMarkerChange(orderIndex, 'frequency', Math.round(Number(e.target.value)))}
                                  placeholder="Frequency"
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  type="number"
                                  value={marker.bandWidth}
                                  onChange={(e) => {
                                    const value = Math.max(0, Number(e.target.value));
                                    handleMarkerChange(orderIndex, 'bandWidth', value);
                                  }}
                                  placeholder="Band Size"
                                />
                              </td>
                              <td className="p-2">
                                <QuantitySelector
                                  value={marker.harmonics}
                                  min={0}

                                  max={20}
                                  onChange={(value) => handleMarkerChange(orderIndex, 'harmonics', value)}
                                />
                              </td>
                              <td className="p-2">
                                <QuantitySelector
                                  value={marker.subHarmonics}
                                  min={0}
                                  max={10}
                                  onChange={(value) => handleMarkerChange(orderIndex, 'subHarmonics', value)}
                                />
                              </td>
                              <td className="p-2">
                                {/* <select
                                  value={marker.axis}
                                  onChange={(e) => handleMarkerChange(orderIndex, 'axis', e.target.value as Axis)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="x">X-Axis</option>
                                  <option value="y">Y-Axis</option>
                                  <option value="z">Z-Axis</option>
                                </select> */}



                                <SelectNative value={marker.axis}
                                  onChange={(e) => handleMarkerChange(orderIndex, 'axis', e.target.value as Axis)}>
                                  <option value="x">X-Axis</option>
                                  <option value="y">Y-Axis</option>
                                  <option value="z">Z-Axis</option>
                                </SelectNative>

                              </td>
                              <td className="p-2">
                                <div className='flex items-center justify-center gap-2'>
                                  <Checkbox
                                    checked={marker.sideBands.enabled}
                                    onCheckedChange={(checked) => handleMarkerChange(orderIndex, 'sideBands.enabled', checked)}
                                  />
                                </div>

                              </td>
                              <td className="p-2">

                                <Input
                                  type="number"
                                  value={marker.sideBands.count}
                                  onChange={(e) => handleMarkerChange(orderIndex, 'sideBands.count', Number(e.target.value))}
                                  disabled={!marker.sideBands.enabled}
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  type="number"
                                  value={marker.sideBands.spacing}
                                  onChange={(e) => handleMarkerChange(orderIndex, 'sideBands.spacing', Number(e.target.value))}
                                  disabled={!marker.sideBands.enabled}
                                />
                              </td>
                              <td className="p-2">
                                <div className="flex items-center justify-start ml-1 mb-1 gap-3">
                                  <div className='flex items-center gap-1.5'>
                                    <Checkbox
                                      checked={marker.sideBands.leftEnabled}
                                      onCheckedChange={(checked) => handleMarkerChange(orderIndex, 'sideBands.leftEnabled', checked)}
                                      disabled={!marker.sideBands.enabled}
                                    />
                                    <label>L</label>
                                  </div>
                                  <div className='flex items-center gap-1.5'>
                                    <Checkbox
                                      checked={marker.sideBands.rightEnabled}
                                      onCheckedChange={(checked) => handleMarkerChange(orderIndex, 'sideBands.rightEnabled', checked)}
                                      disabled={!marker.sideBands.enabled}
                                    />
                                    <label>R</label>
                                  </div>

                                </div>
                              </td>



                              
                              <td className="p-2">
                                <div className='flex gap-5'>
                                  <Button
                                    variant='ghost'
                                    onClick={() => toggleMarkerVisibility(orderIndex)}
                                    className={`w-[80px] flex items-center justify-center gap-1 ${marker.visible ? '' : 'bg-green-100 text-green-700 dark:text-green-600 dark:hover:bg-green-200'}`}
                                  >
                                    {marker.visible ? (
                                      <>
                                        <FiEyeOff />
                                        <span>Hide</span>
                                      </>
                                    ) : (
                                      <>
                                        <FiEye />
                                        <span>Show</span>
                                      </>
                                    )}
                                  </Button>
                                  <Button variant="destructive" onClick={() => handleRemoveMarker(orderIndex)} className=""><Trash2></Trash2></Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              <TabsContent
                value="tab2"
                className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
              >
                <div>
                  <div className="overflow-y-auto mt-2 h-[280px] scrollbar">
                    <table className="w-full border-collapse">
                      <thead className='w-full'>
                        <tr className='bg-slate-50 rounded-md'>
                          <th className="text-left p-2 pl-8 w-[200px]">Start Frequency</th>
                          <th className="text-left p-2 w-[200px]">Warning Amplitude</th>
                          <th className="text-left p-2 w-[200px]">Alert Amplitude</th>
                          <th className="text-left p-2 w-[100px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className='mr-5'>
                        {steppedLineInputs.map((input, index) => (
                          <tr key={index}>
                            <td className="p-2">
                              <input
                                type="number"
                                value={input.startFrequency}
                                onChange={(e) => handleSteppedLineInputChange(index, 'startFrequency', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Start Frequency"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={input.warningAmplitude}
                                onChange={(e) => handleSteppedLineInputChange(index, 'warningAmplitude', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Warning Amplitude"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={input.alertAmplitude}
                                onChange={(e) => handleSteppedLineInputChange(index, 'alertAmplitude', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Alert Amplitude"
                              />
                            </td>
                            <td className="p-2">
                              <Button variant="destructive" onClick={() => {
                                const newInputs = steppedLineInputs.filter((_, i) => i !== index);
                                setSteppedLineInputs(newInputs);
                              }}><Trash2></Trash2></Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Button variant="light" className="ml-4" onClick={addSteppedLineInput}>Add Row</Button>
                    <Button variant="primary" className="ml-4" onClick={generateSteppedLineData}>Generate Stepped Line</Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Card>
    </ErrorBoundary>
  );
};

export default React.memo(FeatureExtraction);
