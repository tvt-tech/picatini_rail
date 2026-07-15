import { useEffect, useRef, useState } from "react";
import { ScreenProvider, useScreenSettings } from "./hooks/screen";
import NumberSpinner from "./components/NumberSpinner";

const range = (start: number, end: number, step: number = 1): number[] =>
  Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, i) => start + i * step);

function ScreenLayer({ width, height }: { width?: number; height?: number }) {
  const { screenWidth, screenHeight, screenClick } = useScreenSettings();

  const w = width ?? screenWidth;
  const h = height ?? screenHeight;
  const centerX = w / 2;
  const centerY = h / 2;

  const factors = [1, 2, 3, 4];

  const cropText = (factor: number) => {
    const calculatedHeightPx = screenHeight / factor;
    const calculatedHeightMoa = calculatedHeightPx * screenClick * 0.3;
    return `${calculatedHeightPx.toFixed(0)}px / ${calculatedHeightMoa.toFixed(0)}MOA`;
  };

  return (
    <svg width={w} height={h}>
      <rect width="100%" height="100%" fill="white" />

      <line x1={centerX} y1={0} x2={centerX} y2={h} stroke="green" strokeWidth={1} />
      <line x1={0} y1={centerY} x2={w} y2={centerY} stroke="green" strokeWidth={1} />

      {factors.map((factor, index) => {
        const rectWidth = w / factor;
        const rectHeight = h / factor;
        const textX = centerX + rectWidth / 2 - w / 50;
        const textY = centerY;

        return (
          <g key={index}>
            <rect
              x={centerX - rectWidth / 2}
              y={centerY - rectHeight / 2}
              width={rectWidth}
              height={rectHeight}
              fill="grey"
              fillOpacity={0.5}
              stroke="black"
              strokeDasharray="5,5"
            />
            <text
              x={textX}
              y={textY}
              fontSize={w / 50}
              fill="black"
              textAnchor="middle"
              transform={`rotate(-90, ${textX}, ${textY})`}
            >
              {cropText(factor)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function CalimatorLayer({ width, height }: { width: number; height: number }) {
  const { zeroY, railAngle, screenClick, moa2px } = useScreenSettings();

  const centerX = width / 2;
  const centerY = height / 2;

  const w5 = moa2px(2.5, height);
  const w10 = moa2px(5, height);

  const moaNums5 = range(-30, 30, 5);
  const moaNums10 = range(-30, 30, 10);

  const localZeroY = moa2px(zeroY * screenClick * 0.3, height) - moa2px(railAngle, height);

  return (
    <svg width={width} height={height}>
      {moaNums5.map((xMoa, index) => {
        const xPx = centerX + moa2px(xMoa, height);
        return (
          <line
            key={index}
            x1={xPx}
            y1={centerY - w5 + localZeroY}
            x2={xPx}
            y2={centerY + w5 + localZeroY}
            stroke="white"
            strokeWidth={1}
          />
        );
      })}
      {moaNums5.map((yMoa, index) => {
        const yPx = centerY + moa2px(yMoa, height);
        return (
          <line
            key={index}
            x1={centerX + w5}
            y1={yPx + localZeroY}
            x2={centerX - w5}
            y2={yPx + localZeroY}
            stroke="white"
            strokeWidth={1}
          />
        );
      })}
      {moaNums10.map((xMoa, index) => {
        const xPx = centerX + moa2px(xMoa, height);
        return (
          <line
            key={index}
            x1={xPx}
            y1={centerY - w10 + localZeroY}
            x2={xPx}
            y2={centerY + w10 + localZeroY}
            stroke="white"
            strokeWidth={1}
          />
        );
      })}
      {moaNums10.map((yMoa, index) => {
        const yPx = centerY + moa2px(yMoa, height);
        return (
          <line
            key={index}
            x1={centerX + w10}
            y1={yPx + localZeroY}
            x2={centerX - w10}
            y2={yPx + localZeroY}
            stroke="white"
            strokeWidth={1}
          />
        );
      })}
      <line
        x1={centerX - moa2px(30, height)}
        y1={centerY + localZeroY}
        x2={centerX + moa2px(30, height)}
        y2={centerY + localZeroY}
        stroke="white"
        strokeWidth={1}
      />
      <line
        x1={centerX}
        y1={centerY - moa2px(30, height) + localZeroY}
        x2={centerX}
        y2={centerY + moa2px(30, height) + localZeroY}
        stroke="white"
        strokeWidth={1}
      />
    </svg>
  );
}

function DropLayer({ width, height }: { width: number; height: number }) {
  const { zeroY, railAngle, moa2px, screenClick, dropAtTargetMoa, dropAtZeroMoa, zeroDistanceM, targetDistanceM } =
    useScreenSettings();

  const centerX = width / 2;
  const centerY = height / 2;

  const localZeroY = moa2px(zeroY * screenClick * 0.3, height) - moa2px(railAngle, height);

  const p1 = {
    x: centerX,
    y: centerY + localZeroY + moa2px(dropAtZeroMoa, height),
  };

  const p2 = {
    x: centerX,
    y: centerY + localZeroY + moa2px(dropAtTargetMoa, height),
  };

  return (
    <svg width={width} height={height}>
      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="red" strokeWidth={1} />

      <line x1={p1.x - 5} y1={p1.y} x2={p1.x + 5} y2={p1.y} stroke="red" strokeWidth={3} />
      <line x1={p1.x} y1={p1.y - 5} x2={p1.x} y2={p1.y + 5} stroke="red" strokeWidth={3} />

      <text x={p1.x - width / 50} y={p1.y + width / 200} fill="red" fontSize={width / 35} textAnchor="end">
        {zeroDistanceM.toFixed(0)}
      </text>

      <line x1={p2.x - 5} y1={p2.y} x2={p2.x + 5} y2={p2.y} stroke="red" strokeWidth={3} />

      <text x={p2.x - width / 50} y={p2.y + width / 200} fill="red" fontSize={width / 35} textAnchor="end">
        {targetDistanceM.toFixed(0)}
      </text>
    </svg>
  );
}

function Reticle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="mb-2.5 aspect-[1.25] w-full overflow-hidden rounded bg-[#2c2831] shadow-md"
    >
      {size.width > 0 && size.height > 0 && (
        <svg width={size.width} height={size.height}>
          <ScreenLayer width={size.width} height={size.height} />
          <g>
            <CalimatorLayer width={size.width} height={size.height} />
            <DropLayer width={size.width} height={size.height} />
          </g>
        </svg>
      )}
    </div>
  );
}

function Distances() {
  const { zeroDistanceM, targetDistanceM, dropAtTargetMoa, dropAtZeroMoa, setValues } = useScreenSettings();

  return (
    <div className="flex flex-col justify-center pt-2.5">
      <div className="flex flex-row justify-center gap-2.5">
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-white">Zero distance, m</span>
          <NumberSpinner
            min={0}
            max={1000}
            step={50}
            editable={false}
            value={zeroDistanceM}
            onChange={(value) => setValues({ zeroDistanceM: value })}
          />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-white">Zero drop, MOA</span>
          <NumberSpinner
            min={0}
            max={300}
            step={5}
            editable={false}
            value={dropAtZeroMoa}
            onChange={(value) => setValues({ dropAtZeroMoa: value })}
          />
        </div>
      </div>

      <div className="flex flex-row justify-center gap-2.5">
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-white">Target distance, m</span>
          <NumberSpinner
            min={0}
            max={3000}
            step={100}
            editable={false}
            value={targetDistanceM}
            onChange={(value) => setValues({ targetDistanceM: value })}
          />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-white">Target drop, MOA</span>
          <NumberSpinner
            min={0}
            max={300}
            step={5}
            editable={false}
            value={dropAtTargetMoa}
            onChange={(value) => setValues({ dropAtTargetMoa: value })}
          />
        </div>
      </div>
    </div>
  );
}

function Controls() {
  const { setValues, zeroY, railAngle, screenClick } = useScreenSettings();

  return (
    <div className="w-full flex-1 rounded bg-[#2c2831] p-2.5 shadow-md">
      <span className="block pt-2.5 text-white">Click size, cm/100m</span>
      <NumberSpinner
        precision={2}
        min={0}
        max={10}
        step={0.01}
        value={screenClick}
        onChange={(value) => setValues({ screenClick: value })}
      />

      <Distances />

      <span className="block pt-2.5 text-white">Zero Y, px</span>
      <NumberSpinner
        min={-300}
        max={300}
        step={5}
        editable={false}
        value={zeroY}
        onChange={(value) => setValues({ zeroY: value })}
      />

      <span className="block pt-2.5 text-white">Picatinny rail angle, MOA</span>
      <NumberSpinner
        min={-50}
        max={50}
        step={5}
        editable={false}
        value={railAngle}
        onChange={(value) => setValues({ railAngle: value })}
      />
    </div>
  );
}

export default function App() {
  return (
    <ScreenProvider>
      <div className="min-h-screen overflow-x-hidden bg-[#25232a]">
        <div className="mx-auto w-full max-w-[720px] p-2.5">
          <Reticle />
          <Controls />
        </div>
      </div>
    </ScreenProvider>
  );
}
