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

import { DataStore } from "../../store/Data";

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

const annotationContext = React.createContext({ measures: ["a", "b"] });

const AnnotationShape: React.FC<any> = (props) => {
  const { stroke, strokeWidth, ...otherProps } = props;
  console.log("render line", props);
  return (
    <g>
      <line {...props} className="recharts-reference-line-line" />
      <text x={props.x1} y={20}>
        foo
      </text>
    </g>
    // <circle cx={props.cx} r="10" cy={props.cy} fill="gold">
    //   <animate
    //     attributeName="r"
    //     from="8"
    //     to="20"
    //     dur="1.5s"
    //     begin="0s"
    //     repeatCount="indefinite"
    //   />
    // </circle>
  );
};

// const Annotation: React.FC = (props) => {
//   return;
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
          <ReferenceLine x="2020-04-22" shape={AnnotationShape} />
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
