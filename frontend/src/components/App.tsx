import React from "react";
import { observer } from "mobx-react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Home } from "../screens/Home";

export const App: React.FC = observer(() => {
  return (
    <Router basename="/corona-map">
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
});
