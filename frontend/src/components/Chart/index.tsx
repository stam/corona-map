import React, { useMemo } from "react";
import AChart from "react-apexcharts";
import { eachRight } from "lodash";
import dayjs from "dayjs";

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

  const chartData: ChartData = useMemo(() => {
    const output: ChartData = {
      options: {
        id: "Corona",
        yaxis: {
          min: 0,
          max: 1000,
          labels: {
            formatter: (val: number) => Math.round(val),
          },
        },
        chart: {
          animations: {
            enabled: false,
          },
          zoom: {
            enabled: false,
          },
        },
        marker: {
          show: false,
        },
        tooltip: {
          custom: function (props: any) {
            const { dataPointIndex, w } = props;
            const value = w.config.series[0].data[dataPointIndex];
            return `
              <div class="arrow_box">
              <span>
            ${value.x}:<br/> ${Math.round(value.y)} cum. cases/100k
              </span>
              </div>
            `;
          },
        },
        xaxis: {
          hideOverlappingLabels: true,
          tickAmount: 8,
          tooltip: {
            enabled: false,
          },
          labels: {
            formatter: function (date: string) {
              return dayjs(date).format("DD MMM");
            },
          },
        },
      },
      series: [
        {
          name: "14day Cumulative per 100k",
          data: [],
        },
      ],
    };
    eachRight(store.casesForCountry, (d) => {
      output.series[0].data.push({
        x: d.date,
        y: d.cum_14day_100k || 0,
      });
    });

    return output;
  }, [store.casesForCountry]);

  return (
    <div>
      <AChart type="line" width="100%" height={320} {...chartData} />
    </div>
  );
};
