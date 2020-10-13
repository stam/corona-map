import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";

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
  border-radius: 4px;
  box-shadow: 0 -1px 1px 0 #e5e5e5, 0 1px 1px 0 #e5e5e5, 0 2px 2px 0 #e5e5e5,
    0 4px 4px 0 #e5e5e5;

  grid-area: ${(props) => props.area};
`;

export const Home: React.FC = observer(() => {
  return (
    <Container>
      <Tile area="1 / 1 / -1 / 7">map</Tile>
      <Tile area="1 / 7 / -1 / -1">details</Tile>
    </Container>
  );
});
