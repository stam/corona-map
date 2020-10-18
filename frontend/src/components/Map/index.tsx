import React from "react";
import { Map as LMap, TileLayer, GeoJSON } from "react-leaflet";
import { LatLngTuple, LeafletMouseEventHandlerFn } from "leaflet";
import styled from "styled-components";

import europe from "./europe.json";

const position: LatLngTuple = [51.925885006913674, 13.146858215332033];

const StyledMap = styled(LMap)`
  flex: 1;
`;

interface MapProps {
  onSelect: (country: string) => void;
}

export const Map: React.FC<MapProps> = (props) => {
  const { onSelect } = props;
  const handleClick: LeafletMouseEventHandlerFn = (event) => {
    onSelect(event.target.feature.properties.NAME);
    // console.log(event.target.feature);
  };
  return (
    <StyledMap center={position} zoom={4}>
      <TileLayer
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        data={europe as any}
        onEachFeature={(feature, layer) => {
          layer.on({ click: handleClick });
        }}
      />
    </StyledMap>
  );
};
