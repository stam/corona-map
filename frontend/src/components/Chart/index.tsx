import React, { useMemo } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Tooltip,
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
    <div>
      <LineChart width={500} height={400} data={data}>
        <XAxis dataKey="date" />
        <YAxis domain={[0, 1000]} />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip isAnimationActive={false} />
        <Line
          type="monotone"
          dot={false}
          dataKey="cum_14day_100k"
          isAnimationActive={false}
          stroke="#8884d8"
        />
      </LineChart>
    </div>
  );
};
