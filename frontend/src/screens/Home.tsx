import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: grid;
  background: #ccc;
`;

const Tile = styled.div``;

export const Home: React.FC = observer(() => {
  return (
    <Container>
      <p>map</p>
    </Container>
  );
});
