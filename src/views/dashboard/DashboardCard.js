import PropTypes from "prop-types";
import { useState } from "react";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from "@mui/material";

// project imports
import MainCard from "ui-component/cards/MainCard";
import SkeletonEarningCard from "ui-component/cards/Skeleton/EarningCard";
import Popup from "ui-component/components/Popup";
import "./style.css";

// assets
import { BiTrendingUp, BiTrendingDown } from "react-icons/bi";
import { IoBusinessOutline } from "react-icons/io5";
import { LiaCheckCircle } from "react-icons/lia";
import { PiShieldCheckLight } from "react-icons/pi";
import { RiSortAsc } from "react-icons/ri";
import { HiEye } from "react-icons/hi";
import { FaCircle } from "react-icons/fa6";
import { TbSortAscending } from "react-icons/tb";
import TotalRecordIcon from "assets/images/icons/total-record-icon.svg";
import ClusteredIcon from "assets/images/icons/clustered-icon.svg";
import { IoMdClose } from "react-icons/io";
import CommonFilters from "./CommonFilters";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  // backgroundColor: theme.palette.secondary.dark,
  // color: '#fff',
  overflow: "hidden",
  position: "relative",
  minHeight: "184.04px",
  cursor: "pointer",
  // '&:after': {
  //   content: '""',
  //   position: 'absolute',
  //   width: 210,
  //   height: 210,
  //   background: theme.palette.secondary[800],
  //   borderRadius: '50%',
  //   top: -85,
  //   right: -95,
  //   [theme.breakpoints.down('sm')]: {
  //     top: -105,
  //     right: -140
  //   }
  // },
  // '&:before': {
  //   content: '""',
  //   position: 'absolute',
  //   width: 210,
  //   height: 210,
  //   background: theme.palette.secondary[800],
  //   borderRadius: '50%',
  //   top: -125,
  //   right: -15,
  //   opacity: 0.5,
  //   [theme.breakpoints.down('sm')]: {
  //     top: -155,
  //     right: -70
  //   }
  // }
}));

// Define an object mapping each value of Icon to its corresponding styles
const iconStyles = {
  AL: { background: "#e5e4ff", color: "#3D42DF" },
  TR: { background: "#fef2d6", color: "#fec53d" },
  AM: { background: "#d9f7e7", color: "#4ad991" },
  CM: { background: "#ffded2", color: "#ff9066" },
  EM: { background: "#fce4ff", color: "#ed5fff" },
  FAP: { background: "#f1ffd2", color: "#b9c604" },
  AB: { background: "#d4fec9", color: "#43DB53" },
  PR: { background: "#ffeec5", color: "#FEC53D" },
};

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const DashboardCard = ({
  isLoading,
  Heading,
  Icon,
  TotalValue,
  Value,
  IncPerviousLoad,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <>
        <CardWrapper
          border={false}
          content={false}
          onClick={() => setPopupOpen(true)}
        >
          <Box sx={{ p: 1.5 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                      {Heading}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...(iconStyles[Icon] || {}),
                      }}
                      className="AvtarStyle"
                      // onClick={handleClick}
                    >
                      {Icon === "AL" && <IoBusinessOutline fontSize={38} />}
                      {Icon === "TR" && (
                        <img src={TotalRecordIcon} alt="Total Records Icon" />
                      )}
                      {Icon === "AM" && <PiShieldCheckLight fontSize={38} />}
                      {Icon === "CM" && (
                        <img src={ClusteredIcon} alt="Clustered Icon" />
                      )}
                      {Icon === "EM" && <LiaCheckCircle fontSize={38} />}
                      {Icon === "FAP" && (
                        <RiSortAsc
                          fontSize={35}
                          style={{ transform: "scaleX(-1)" }}
                        />
                      )}
                      {Icon === "AB" && <FaCircle fontSize={28} />}
                      {Icon === "PR" && <HiEye fontSize={38} />}
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography className="Typography700" sx={{ mt: -2 }}>
                      {TotalValue}{Icon === "FAP" && <>%</>}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mt: 3 }}>
                {Icon !== "AM" && Icon !== "FAP" && Icon !== "AB" && Icon !== "PR" && 
                <Typography
                  sx={{
                    display: "flex",
                    // alignItems: "center",
                    // bgcolor:"yellow"
                  }}
                >
                  {IncPerviousLoad && Value !== "weekType2" && (
                    <>
                      <BiTrendingUp fontSize={25} color="#E11927" />
                      <Typography className="Typography600" sx={{ ml: 0.5 }}>
                        <span style={{ color: "#E11927" }}>{Value<0 ? -Value : Value}</span> Up
                        from previous week
                      </Typography>
                    </>
                  )}
                  {!IncPerviousLoad && Value !== "weekType2" && (
                    <>
                      <BiTrendingDown
                        style={{ transform: "rotate3d(0, 59, 1, 173deg)", top: "-3px", position: "relative" }}
                        fontSize={25}
                        color="#00B69B"
                      />
                      <Typography className="Typography600" sx={{ ml: 0.5 }}>
                        <span style={{ color: "#00B69B" }}>{Value<0 ? -Value : Value}</span> Down from
                        previous week
                      </Typography>
                    </>
                  )}
                </Typography>
}
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
        
        { <Popup
        open={popupOpen}
        // overflowY="auto"
        // height="220px"
        width={1018}
        outerBoxClass="outerBoxClass1"
        titleClass="titleClass1"
        contentClass="contentClass1"
        title={Heading}
        content={
          <>
            <CommonFilters Heading={Heading} />
            <Avatar
              sx={{
                width: "25px",
                height: "25px",
                cursor: "pointer",
                bgcolor: "#e11927",
                position: "absolute",
                top: "-2%",
                right: "-10px",
                zIndex: 9999,
              }}
              onClick={() => setPopupOpen(false)}
            >
              <IoMdClose fontSize={18} color="#fff" />
            </Avatar>
          </>
        }
      /> }
      </>
      )}
    </>
  );
};

DashboardCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default DashboardCard;
