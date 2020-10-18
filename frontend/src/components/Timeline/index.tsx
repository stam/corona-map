import React from "react";
import { observer } from "mobx-react";
import { store } from "../../store/Data";

interface TimelineProps {}

export const Timeline: React.FC<TimelineProps> = observer((props) => {
  return (
    <div>
      <h2>Timeline</h2>
      <p>{store.date.toLocaleDateString()}</p>
    </div>
  );
});
