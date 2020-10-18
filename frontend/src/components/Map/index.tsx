import React, { useMemo } from "react";
import { Map as LMap, TileLayer, GeoJSON } from "react-leaflet";
import {
  LatLngTuple,
  LeafletMouseEventHandlerFn,
  StyleFunction,
} from "leaflet";
import styled from "styled-components";
import { DataStore } from "../../store/Data";

const position: LatLngTuple = [54.83312727008725, 39.43954467773438];

const StyledMap = styled(LMap)`
  flex: 1;

  .leaflet-pane {
    z-index: initial;
  }
`;

interface Props {
  onSelect: (country: string) => void;
  store: DataStore;
}

const LEGEND = {
  20: "#f2d776",
  60: "#e2a941",
  120: "#cd6b1a",
  240: "#b73b12",
  100000: "#7d1008",
};

const findColorForValue = (value: number) => {
  const legendItem = Object.entries(LEGEND).find(([maxValue, color]) => {
    return value < parseInt(maxValue);
  });

  return legendItem ? legendItem[1] : "hotpink";
};

export const Map: React.FC<Props> = (props) => {
  const { store, onSelect } = props;
  const handleClick: LeafletMouseEventHandlerFn = (event) => {
    onSelect(event.target.feature.properties.NAME);
  };

  const styleFeature: StyleFunction<any> = useMemo(() => {
    return (feature) => {
      const country = feature?.properties.NAME;
      const value = store.resultForSelectedDate[country].count;

      return {
        fillColor: value === undefined ? "hotpink" : findColorForValue(value),
        weight: 1,
        opacity: 0.5,
        color: "black",
        fillOpacity: 0.79,
      };
    };
  }, [store.resultForSelectedDate]);

  return (
    <StyledMap
      center={position}
      zoom={4}
      // onViewportChanged={(a: any) => {
      //   console.log("viewPortChanged", a);
      // }}
    >
      <TileLayer
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        data={store.geoJson}
        style={styleFeature}
        onEachFeature={(feature, layer) => {
          layer.on({ click: handleClick });
        }}
      />
    </StyledMap>
  );
};
