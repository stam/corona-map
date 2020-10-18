import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";

import { Map } from "../components/Map";
import "leaflet/dist/leaflet.css";
import { store } from "../store/Data";
import { Details } from "../components/Details";
import { Timeline } from "../components/Timeline";

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: grid;
  background: #f9f9f9;
  padding: 1rem;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  grid-gap: 1rem;
`;

interface TileProps {
  area: string;
}
const Tile = styled.div<TileProps>`
  background: white;
  border-radius: 16px;
  box-shadow: 0 -1px 1px 0 #e5e5e5, 0 1px 1px 0 #e5e5e5, 0 2px 2px 0 #e5e5e5,
    0 4px 4px 0 #e5e5e5;

  grid-area: ${(props) => props.area};
  z-index: 1;
  padding: 0 1rem;
`;

const Background = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  z-index: 0;

  > * {
    flex: 1;
  }
`;

export const Home: React.FC = observer(() => {
  return (
    <Container>
      <Background>
        <Map
          store={store}
          onSelect={(country: string) => store.selectCountry(country)}
        />
      </Background>
      <Tile area="1 / 6 / -1 / -1">
        <Timeline />
        <Details store={store} />
      </Tile>
    </Container>
  );
});
