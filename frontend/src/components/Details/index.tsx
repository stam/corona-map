import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { sortBy } from "lodash";

import { DataStore } from "../../store/Data";
import { translateMeasure } from "./util";

const StyledTable = styled.table`
  table:first-of-type td:first-of-type {
    width: 3rem;
    text-align: right;
  }
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const BottomText = styled.div`
  margin-top: auto;
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.5);
  padding-bottom: 1rem;
`;

interface DetailsProps {
  store: DataStore;
}

export const Details: React.FC<DetailsProps> = observer((props) => {
  const { store } = props;

  let result;
  if (store.selectedCountry) {
    result = store.resultForSelectedDate[store.selectedCountry];
  }

  return (
    <Container>
      <h2>{store.selectedCountry}</h2>
      {store.error && <p>{store.error}</p>}
      {result && (
        <div>
          <StyledTable>
            <tbody>
              <tr>
                <td>{result.count}</td>
                <td>14-day cumulative number cases per 100k</td>
              </tr>
              <tr>
                <td>{result.newCases}</td>
                <td>new cases</td>
              </tr>
              <tr>
                <td>{result.newDeaths}</td>
                <td>new deaths</td>
              </tr>
            </tbody>
          </StyledTable>
          <StyledTable>
            <thead>
              <tr>
                <td>measure</td>
                <td>from</td>
                <td>until</td>
              </tr>
            </thead>
            <tbody>
              {sortBy(result.measures, "date_start").map((measure) => (
                <tr key={measure.Response_measure}>
                  <td>{translateMeasure(measure.Response_measure)}</td>
                  <td>{measure.date_start}</td>
                  <td>{measure.date_end}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </div>
      )}
      <BottomText>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide"
        >
          https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ecdc.europa.eu/en/publications-data/download-data-response-measures-covid-19"
        >
          https://www.ecdc.europa.eu/en/publications-data/download-data-response-measures-covid-19
        </a>
      </BottomText>
    </Container>
  );
});
