import React from "react";
import { observer } from "mobx-react";

import { DataStore } from "../../store/Data";
import styled from "styled-components";

const StyledTable = styled.table`
  td:first-of-type {
    width: 3rem;
    text-align: right;
  }
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

  // const resultForCountry = store.resultForSelectedDate[store.selectedCountry];
  console.log({
    a: result?.population,
    b: result?.population?.toLocaleString(),
  });
  return (
    <div>
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
        </div>
      )}
    </div>
  );
});
