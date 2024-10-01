import PropTypes from "prop-types";
import { useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Button,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { PieChart } from "@mui/x-charts";

// project imports
import MainCard from "ui-component/cards/MainCard";
import SkeletonPopularCard from "ui-component/cards/Skeleton/PopularCard";
import { gridSpacing } from "store/constant";

// assets
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { VscCircleFilled } from "react-icons/vsc";
import { minHeight } from "@mui/system";

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PerformanceGraph = ({ isLoading, graphData }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard contentSX={{p:2}}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid
                  container
                  alignContent="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Typography variant="h4">Current Status</Typography>
                  </Grid>
                  <Grid item>
                    <MoreHorizOutlinedIcon
                      fontSize="medium"
                      sx={{
                        // color: theme.palette.primary[200],
                        color: "#C7C7C7",
                        // cursor: "pointer",
                      }}
                      aria-controls="menu-popular-card"
                      aria-haspopup="true"
                      // onClick={handleClick}
                    />
                    <Menu
                      id="menu-popular-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <MenuItem onClick={handleClose}> Today</MenuItem>
                      <MenuItem onClick={handleClose}> This Month</MenuItem>
                      <MenuItem onClick={handleClose}> This Year </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <div className="pieChart">
                  <PieChart
                    series={[
                      {
                        data:
                          graphData?.totalRecords && graphData?.totalRecords > 0
                            ? [
                                {
                                  value: graphData?.approvedMatches || 0,
                                  color: "#4AD991",
                                },
                                {
                                  value: graphData?.Total_Remaining || 0,
                                  color: "#FF9066",
                                },
                              ]
                            : [
                                {
                                  value: 0.00000000000001,
                                  color: "#f5f6fa",
                                },
                              ],
                        startAngle: 0,
                        endAngle: 360,
                      },
                    ]}
                    height={150}
                  />
                </div>
              </Grid>

              <Grid item xs={12} sx={{ mt: 0.5, mb: { md:2, lg:3 } }}>
                <Grid
                  container
                  direction="row"
                  sx={{
                    boxShadow: "0px 8px 10px rgba(0, 0, 0, 0.04)",
                    borderRadius: "12px",
                    p: 2,
                  }}
                >
                  <Grid item xs={4} sx={{ borderRight: "1px solid #f4f7fe" }}>
                    <Grid container justifyContent="center">
                      <Grid item md={2} lg={1.5} xl={1}>
                        {/* <Typography> */}
                          <VscCircleFilled style={{ color: "#f5f6fa" }} />
                        {/* </Typography> */}
                      </Grid>
                      <Grid item md={10} lg={10.5} xl={11}>
                        <Typography className="performanceTypo" sx={{fontSize: {md:"10px",lg:"11px",xl:"14px"}}}>
                          Total Records
                        </Typography>
                        <Typography className="performanceTypoValue">
                          {graphData?.totalRecords || 0}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={4} sx={{ borderRight: "1px solid #f4f7fe" }}>
                    <Grid container justifyContent="center">
                      <Grid item md={2} lg={1.5} xl={1}>
                        {/* <Typography sx={{mr:{  xl: 1}}}> */}
                          <VscCircleFilled style={{ color: "#4ad991" }} />
                        {/* </Typography> */}
                      </Grid>
                      <Grid item md={10} lg={10.5} xl={11}>
                        <Typography className="performanceTypo" sx={{fontSize: {md:"10px",lg:"11px",xl:"14px"}}}>
                          Approved Records
                        </Typography>
                        <Typography className="performanceTypoValue">
                          {graphData?.approvedMatches || 0}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={4}>
                    <Grid
                      container
                      // alignItems="center"
                      // justifyContent="space-between"
                      // direction="column"
                      // sx={{p:1,pt:2,pb:2}}
                      justifyContent="center"
                      lg={12}
                    >
                      <Grid item md={2} lg={1.5} xl={1}>
                        {/* <Typography> */}
                          <VscCircleFilled style={{ color: "#fe9b75" }} />
                        {/* </Typography> */}
                      </Grid>
                      <Grid item md={10} lg={10.5} xl={11}>
                        <Typography className="performanceTypo" sx={{fontSize: {md:"10px",lg:"11px",xl:"14px"}}}>
                          Total Remaining
                        </Typography>
                        <Typography className="performanceTypoValue">
                          {graphData?.Total_Remaining || 0}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
        </MainCard>
      )}
    </>
  );
};

PerformanceGraph.propTypes = {
  isLoading: PropTypes.bool,
};

export default PerformanceGraph;
