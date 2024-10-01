import React, { useState } from "react";
import BasicDateCalendar from "ui-component/components/BasicCalender";
import dayjs from "dayjs"; // Import dayjs
import { useDispatch, useSelector } from "react-redux";
import { SET_DATE_RANGES } from "store/actions";

const CommonCalender = ({ popupOpen, snackMessage }) => {
  const dispatch = useDispatch();
  const dateRanges = useSelector((state) => state.DashboardSlice.dateRanges);
  const [valueFrom, setValueFrom] = useState(dayjs(dateRanges?.startOfWeek));
  const [valueTo, setValueTo] = useState(dayjs(dateRanges?.endOfWeek));

  const handleChangeFrom = (newValue) => {
    setValueFrom(newValue);
  };

  const handleChangeTo = (newValue) => {
    setValueTo(newValue);
  };

  const handleClear = () => {
    setValueFrom(null);
    setValueTo(null);
  };

  const handleDone = () => {
    // console.log('From:', valueFrom?.format('YYYY-MM-DD'), 'To:', valueTo?.format('YYYY-MM-DD'));
    const startOfWeek = valueFrom?.format("YYYY-MM-DD"),
      endOfWeek = valueTo?.format("YYYY-MM-DD");
    if (!startOfWeek || !endOfWeek) {
      snackMessage({
        open: true,
        severity: "error",
        message: "Please select a start and end date.",
      });
    } else {
      dispatch({ type: SET_DATE_RANGES, payload: { startOfWeek, endOfWeek } });
      popupOpen()
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <BasicDateCalendar
        valueFrom={valueFrom}
        valueTo={valueTo}
        onChangeFrom={handleChangeFrom}
        onChangeTo={handleChangeTo}
        onClear={handleClear}
        onDone={handleDone}
      />
    </div>
  );
};

export default CommonCalender;
