import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

// third-party
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";

// project imports
import SkeletonTotalGrowthBarChart from "ui-component/cards/Skeleton/TotalGrowthBarChart";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import "./style.css";
import "../pages/ClusteredMatches/style.css"
import Popup from "ui-component/components/Popup";
import CommonFilters from "./CommonFilters";
import { IoMdClose } from "react-icons/io";

const status = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "month",
    label: "This Month",
  },
  {
    value: "year",
    label: "This Year",
  },
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const UserAnalyticsCard = ({ isLoading, userAnalyticsArray }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const { navType } = customization;
  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  // const userAnalyticsArray = [
  //   { username: "John", totalApprovedMatches: 20, fillAllPercentage: 80 },
  //   { username: "Jatin", totalApprovedMatches: 50, fillAllPercentage: 50 },
  //   { username: "Rohit", totalApprovedMatches: 89, fillAllPercentage: 20 },
  //   { username: "Vipul", totalApprovedMatches: 56, fillAllPercentage: 60 },
  //   { username: "Kushal", totalApprovedMatches: 45, fillAllPercentage: 70 },
  //   { username: "Dipanshu", totalApprovedMatches: 54, fillAllPercentage: 30 },
  // ];

  // const [userAnalyticsArray, setUserAnalyticsArray] = useState(responseArray)
  // console.log("arra", userAnalyticsArray)

  const serialNumber = (index) => {
    return index + 1;
    // return (page - 1) * paginationData?.rowPerPage + index + 1;
  };

  const getColor = (fillAllPercentage) => {
    if (fillAllPercentage <= 50) return "rgb(74, 217, 145)";
    if (fillAllPercentage <= 75) return "rgb(255, 144, 102)";
    return "red";
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard contentSX={{p:2}}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                    User Analytics
                  </Typography>
                </Grid>
                <Grid item>
                  <MoreHorizOutlinedIcon
                    fontSize="medium"
                    sx={{
                      // color: theme.palette.primary[200],
                      color: "#C7C7C7",
                      cursor: "pointer",
                    }}
                    aria-controls="menu-popular-card"
                    aria-haspopup="true"
                    onClick={() => {
                      const baseURL = window.location.origin;
                      const Url = baseURL + "/dashboard/user_analytics";
                      window.open(Url,"_blank")
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {/* <TableContainer component={Paper}> */}
              {/* <Paper
                sx={{ width: "100%", borderRadius: 0, overflow: "hidden", bgcolor:"red",mb:0,pb:0 }}
              > */}
                <TableContainer sx={{ borderRadius: 0, height: 273 }} className="custom-scrollbar analytics">
                  <Table
                    stickyHeader
                    aria-label="sticky table"
                    className="userAn"
                    sx={{borderRadius: 0,}}
                  >
                    <TableHead className="userAn_Head">
                      <TableRow>
                        <TableCell align="center">#</TableCell>
                        <TableCell align="center" sx={{minWidth:"105px"}}>User Name</TableCell>
                        <TableCell align="center" sx={{minWidth:"128px"}}>Total Approved</TableCell>
                        <TableCell align="center" sx={{minWidth:"127px"}}>Total Clustered</TableCell>
                        <TableCell align="center" sx={{minWidth:"148px"}}>
                          Fill-All Percentage
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userAnalyticsArray && userAnalyticsArray.length > 0 ? (
                        userAnalyticsArray?.map((Item, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              borderBottom: "1px solid #e0e3e8",
                              background: index % 2 !== 0 ? "#F1F4F9" : "",
                            }}
                          >
                            <TableCell align="center">
                              {serialNumber(index)}
                            </TableCell>
                            <TableCell align="center">
                              {Item?.username}
                            </TableCell>
                            <TableCell align="center">
                              {Item?.totalApprovedMatches || 0}
                            </TableCell>
                            <TableCell align="center">
                              {Item?.totalApprovedCluster || 0}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ position: "relative" }}
                            >
                              <div style={{ position: "relative" }}>
                                <LinearProgress
                                  variant="determinate"
                                  className="linearProgress"
                                  value={Item?.fillAllPercentage || 0}
                                  sx={{
                                    height: 24,
                                    "& .MuiLinearProgress-bar": {
                                      backgroundColor: getColor(
                                        Item?.fillAllPercentage || 0
                                      ),
                                    },
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  color="textPrimary"
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "100%",
                                    lineHeight: "24px",
                                    fontWeight: "bold",
                                    color: "white",
                                  }}
                                >
                                  {Item?.fillAllPercentage || 0}%
                                </Typography>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell style={{ textAlign: "center" }} colSpan={6}>
                              No Record Found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              {/* </Paper> */}
              {/* </TableContainer> */}
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

UserAnalyticsCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default UserAnalyticsCard;
