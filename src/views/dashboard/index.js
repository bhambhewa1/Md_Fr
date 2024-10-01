import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MENU_OPEN, SET_DATE_RANGES } from "store/actions";

// material-ui
import {
  Avatar,
  Autocomplete,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

// project imports
import DashboardCard from "./DashboardCard";
import PerformanceGraph from "./PerformanceGraph";
import UserAnalyticsCard from "./UserAnalyticsCard";
import { gridSpacing } from "store/constant";
import CustomPaper from "ui-component/components/CustomPaper";
import { IoMdClose } from "react-icons/io";
import Popup from "ui-component/components/Popup";
import CommonCalender from "./CommonCalender";
import { dateRange } from "utils/global_functions";
import Loading from "ui-component/components/Loading";
import Message from "ui-component/components/Snackbar/Snackbar";
import Axios from "api/Axios";
import { API } from "api/API";
const moment = require("moment");

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = ({ Heading }) => {
  const dispatch = useDispatch();
  const options = ["This Week", "Last Week", "Select a Date Range"];
  const [selectedOption, setSelectedOption] = useState(options[0]); // Initially set to null
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });
  const dateRanges = useSelector((state) => state.DashboardSlice.dateRanges);

  const showDates = dateRange();
  // console.log("my dates", showDates);

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  const [graphData, setGraphData] = useState({
    Total_Remaining: 0,
    approvedMatches: 0,
    totalRecords: 0,
  });

  const [userAnalytic, setUserAnalytic] = useState([]);

  const [cardArray, setCardArray] = useState([
    {
      Icon: "AL",
      Heading: "All Companies",
      TotalValue: 0,
      value: 0,
      IncPerviousLoad: true,
    },
    {
      Icon: "TR",
      Heading: "Total Records",
      TotalValue: 0,
      value: 0,
      IncPerviousLoad: true,
    },
    {
      Icon: "AM",
      Heading: "Approved Matches",
      TotalValue: 0,
      value: 0,
      IncPerviousLoad: true,
    },
    {
      Icon: "CM",
      Heading: "Clustered Matches",
      TotalValue: 0,
      value: 0,
      IncPerviousLoad: true,
    },
    {
      Icon: "EM",
      Heading: "Exact Matches",
      TotalValue: 0,
      value: 0,
      IncPerviousLoad: true,
    },
    {
      Icon: "FAP",
      Heading: "Fill All Percentage",
      TotalValue: 0,
      value: 0,
      IncPerviousLoad: true,
    },
    {
      Icon: "AB",
      Heading: "Active Batches",
      TotalValue: 0,
      value: 0,
      IncPerviousLoad: true,
    },
    {
      Icon: "PR",
      Heading: "Published Records",
      TotalValue: 0,
      value: 0,
      IncPerviousLoad: true,
    },
  ]);

  const Dashboard_Data = async () => {
    try {
      setIsLoading(true);
      let data = {
        fromDate: dateRanges?.startOfWeek,
        toDate: dateRanges?.endOfWeek,
        weekType:
          selectedOption === options[2]
            ? 2
            : selectedOption === options[1]
            ? 1
            : 0,
      };
      const res1 = await Axios.post(API.Dashboard_Interface_data_V1, data);
      if (res1?.data?.success) {
        // console.log("response", res1.data);
        const response = res1?.data;
        setCardArray([...response?.cardArray]);
        setGraphData({ ...response?.current_status_graph });
        // setIsLoading(false);
        const res2 = await Axios.post(API.Dashboard_Interface_data_V2, data);
        if (res2?.data) {
          // console.log("res2", res2?.data?.response);
          setUserAnalytic(res2?.data?.response);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log("ERROR in fetching all new clustered files", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.message,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOption === options[0]) {
      const payload = {
        startOfWeek: showDates?.currentWeek?.startOfWeek,
        endOfWeek: showDates?.currentWeek?.endOfWeek,
      };
      dispatch({ type: SET_DATE_RANGES, payload });
    }
    if (selectedOption === options[1]) {
      const payload = {
        startOfWeek: showDates?.lastWeek?.startOfWeek,
        endOfWeek: showDates?.lastWeek?.endOfWeek,
      };
      dispatch({ type: SET_DATE_RANGES, payload });
    }
  }, [selectedOption]);

  useEffect(() => {
    if (Object.keys(dateRanges).length > 0) {
      Dashboard_Data();
    }
  }, [dateRanges]);

  return (
    <>
      <Grid container spacing={gridSpacing} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={gridSpacing}
            sx={{
              display: "flex",
              // flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Grid item xs={6} md={8} lg={9}>
              {
                <>
                  {dateRanges?.startOfWeek === dateRanges?.endOfWeek ? (
                    <Typography sx={{ fontSize: "16px", textAlign: "right" }}>
                      Showing Results For{" "}
                      <span style={{ fontWeight: 500 }}>
                        {moment(dateRanges?.startOfWeek, "YYYY-MM-DD").format(
                          "DD-MM-YYYY"
                        )}
                      </span>
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: "16px", textAlign: "right" }}>
                      Showing Results From{" "}
                      <span style={{ fontWeight: 500 }}>
                        {moment(dateRanges?.startOfWeek, "YYYY-MM-DD").format(
                          "DD-MM-YYYY"
                        )}
                      </span>{" "}
                      To{" "}
                      <span style={{ fontWeight: 500 }}>
                        {moment(dateRanges?.endOfWeek, "YYYY-MM-DD").format(
                          "DD-MM-YYYY"
                        )}
                      </span>
                    </Typography>
                  )}
                </>
              }
            </Grid>

            <Grid item xs={6} md={4} lg={3}>
              <Autocomplete
                autoHighlight
                name="DateRange"
                disableClearable
                options={options}
                getOptionLabel={(option) => option || ""}
                onChange={(_, newValue) => {
                  // console.log("newValue",newValue)
                  if (newValue === options[2]) {
                    setPopupOpen(true);
                  } else {
                    setSelectedOption(newValue);
                  }
                }}
                onOpen={() => {
                  if (selectedOption === options[2]) {
                    setSelectedOption(null);
                  }
                }}
                value={selectedOption} // This will be null initially
                isOptionEqualToValue={(option, value) => option === value}
                PaperComponent={CustomPaper}
                renderOption={(props, option) => <li {...props}>{option}</li>}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Please select a option"
                    onBlur={() => {
                      if (!selectedOption) {
                        setSelectedOption(options[2]);
                      }
                    }}
                    // sx={{ width: "300px" }}
                  />
                )}
                key={(option) => option}
                noOptionsText="No Results Found"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            {cardArray &&
              cardArray.map((Item, index) => (
                <Grid key={index} item xs={12} sm={6} lg={3} xl={3}>
                  <DashboardCard
                    isLoading={isLoading}
                    Heading={Item?.Heading}
                    Icon={Item?.Icon}
                    TotalValue={Item?.TotalValue || 0}
                    Value={
                      selectedOption === options[2]
                        ? "weekType2"
                        : Item?.value || 0
                    }
                    IncPerviousLoad={Item?.IncPerviousLoad}
                  />
                </Grid>
              ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={7}>
              <UserAnalyticsCard
                isLoading={isLoading}
                userAnalyticsArray={userAnalytic}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <PerformanceGraph isLoading={isLoading} graphData={graphData} />
            </Grid>
          </Grid>
        </Grid>
        <Popup
          open={popupOpen}
          // width={700}
          height={500}
          outerBoxClass="outerBoxClass1"
          titleClass="titleClass1"
          contentClass="contentClass1"
          title={Heading}
          content={
            <>
              <CommonCalender
                popupOpen={() => {
                  setPopupOpen(false);
                  setSelectedOption(options[2]);
                }}
                snackMessage={(obj) => setSnackbar(obj)}
              />
              <Avatar
                sx={{
                  width: "25px",
                  height: "25px",
                  cursor: "pointer",
                  bgcolor: "#e11927",
                  position: "absolute",
                  top: "-3%",
                  right: "-6px",
                  zIndex: 9999,
                }}
                onClick={() => setPopupOpen(false)}
              >
                <IoMdClose fontSize={18} color="#fff" />
              </Avatar>
            </>
          }
        />
      </Grid>
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </>
  );
};

export default Dashboard;
