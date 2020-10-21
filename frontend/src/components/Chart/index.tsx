import React, { useMemo } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import dayjs from "dayjs";

import { DataStore, store as dataStore } from "../../store/Data";

interface Props {
  store: DataStore;
}

interface Series {
  name: string;
  data: { x: string; y: number }[];
}

interface ChartData {
  options: any;
  series: Series[];
}

interface AnnotationProps {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  stroke: any;
  shape: any;
  strokeWidth: number;
  x: string;
}

export const AnnotationShape: React.FC<any> = (props) => {
  const { x } = props;

  // Not clean to use singleton without context or props, but recharts sucks and is not extensible at all.
  // Can't even use context here, or use a custom component which wraps ReferenceLine...
  const measures = dataStore.measuresForCountry[x];

  return (
    <g>
      <line {...props} className="recharts-reference-line-line" />
      {measures.map((m: string, i: number) => (
        <text key={i} x={props.x1} y={20 + 15 * i}>
          {m}
        </text>
      ))}
    </g>
  );
};

// const ReferenceLine: React.FC = (props) => {
//   return <RLine x="2020-04-22" shape={AnnotationShape} />;
// };

export const Chart: React.FC<Props> = (props) => {
  const { store } = props;

  const data = useMemo(() => {
    return store.casesForCountry
      .slice()
      .reverse()
      .map((d) => {
        return {
          date: d.date,
          cum_14day_100k: Math.round(d.cum_14day_100k || 0),
        };
      });
  }, [store.casesForCountry]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis domain={[0, 1000]} />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip isAnimationActive={false} />
          <ReferenceLine x={dayjs(store.date).format("YYYY-MM-DD")} />
          {/* {Object.keys(store.measuresForCountry).map((d) => (
              <ReferenceLine key={d} x={d} shape={AnnotationShape} />
            ))} */}
          <Line
            type="monotone"
            dot={false}
            dataKey="cum_14day_100k"
            isAnimationActive={false}
            stroke="#8884d8"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
