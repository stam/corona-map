import React from "react";
import { observer } from "mobx-react";

import { DataStore } from "../../store/Data";

interface DetailsProps {
  store: DataStore;
}

export const Details: React.FC<DetailsProps> = observer((props) => {
  const { store } = props;
  return (
    <div>
      <h2>{store.selectedCountry}</h2>
      {store.error && <p>{store.error}</p>}
    </div>
  );
});
