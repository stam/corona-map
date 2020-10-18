import React, { useCallback } from "react";
import { observer } from "mobx-react";
import { store } from "../../store/Data";
import styled from "styled-components";

const Slider = styled.input`
  width: 100%;
`;

interface TimelineProps {}

export const Timeline: React.FC<TimelineProps> = observer((props) => {
  const handleChange = useCallback((e) => {
    const addedDays = e.target.value;

    const startDateUnix = store.startDate.getTime();
    const result = new Date(startDateUnix + addedDays * 1000 * 60 * 60 * 24);
    store.changeDate(result);
  }, []);

  const startDate = store.startDate;
  const date = store.visibleDate;

  const diffInDays =
    (date.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24;

  // console.log("store", diffInDays);
  return (
    <div>
      <h2>Timeline</h2>
      <Slider
        type="range"
        min={0}
        max={store.dateCount}
        value={diffInDays}
        onChange={handleChange}
      />
      <p>{store.visibleDate.toLocaleDateString()}</p>
    </div>
  );
});
