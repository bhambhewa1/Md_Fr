import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { MENU_OPEN } from "store/actions";
import MainCard from "ui-component/cards/MainCard";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { IoMdRefresh } from "react-icons/io";

import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  TablePagination,
  TextField,
} from "@mui/material";
import "./style.css";
import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "ui-component/components/Loading";
import Message from "ui-component/components/Snackbar/Snackbar";
import Row from "./Row";

const ClusteredMatches = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [options, setOptions] = useState([]);
  const [reloadCheck, setReloadCheck] = useState(0);
  const [clData, setClData] = useState({});
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  const dispatch = useDispatch();
  const Profile_Details = localStorage.getItem("Profile_Details")
  const Details = JSON.parse(Profile_Details)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const serialNumber = (page, index) => {
    return page * rowsPerPage + index + 1;
  };

  const RefreshAllClusterFiles = async () => {
    try {
      setIsLoading(true);
      const res1 = await Axios.get(API.Download_blobs);
      if (res1?.data?.success) {
        // console.log("profile", res.data)
        const res2 = await Axios.post(API.Upload_all_blobs);
        if (res2?.data?.success) {
          const res3 = await Axios.get(API.Give_UniqueID_Backend);
          if (res3?.data?.success) {
            setSnackbar({
              open: true,
              message: res3.data.message,
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }
        setIsLoading(false);
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

  const CheckReloadCluster = async () => {
    try {
      setIsLoading(true);
      const res = await Axios.get(API.Reload_Check);
      if (res?.data) {
        // console.log("Check reload", res.data)
        if (res.data.status) {
          setReloadCheck(res.data.status);
          // setSnackbar({
          //   open: true,
          //   message: res.data.message,
          // });
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in checking all files are empty or not", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.message,
      });
      setIsLoading(false);
    }
  };

  const GetCompainesName = async () => {
    try {
      setIsLoading(true);
      const res = await Axios.get(API.Companies_Name);
      if (res) {
        // console.log("profile", res.data)
        setOptions(res?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in fetching Companies Names", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.message,
      });
      setIsLoading(false);
    }
  };

  const GetCompanyData = async (data) => {
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Get_Company_Data, { filename: data, email: Details.email  });
      if (res) {
        // console.log("clData", res.data)
        setClData(res?.data);
        if (Object.keys(res?.data).length === 0) {
          GetCompainesName();
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in fetching Company Data", error.response.status);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.response.status === 403 ? error.response.data.error:  error.message,
      });
      setIsLoading(false);
    }
  };

  const IsFileLocked = async (data) => {
    const profile = JSON.parse(localStorage.getItem("Profile_Details"));
    try {
      setIsLoading(true);
      const res = await Axios.post(API.File_Locked, {
        email: profile.email,
        filename: data,
        name: profile.name,
      });
      if (res?.data) {
        if (res.data.success) {
          GetCompanyData(data);
        } else {
          setSnackbar({
            open: true,
            severity: "error",
            message: res.data.message,
          });
          setCompany("");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log("ERROR in storing user for current file locked", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.message,
      });
      setIsLoading(false);
    }
  };

  const DeleteLockedUser = async (perviousCompany, newCompany) => {
    const profile = JSON.parse(localStorage.getItem("Profile_Details"));
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Delete_User_Locked, {
        email: profile.email,
        filename: perviousCompany,
      });
      if (res?.data) {
        // console.log("delete locked user", res.data);
        if (newCompany) {
          IsFileLocked(newCompany);
        } else {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log("ERROR in deleting user locked, if file closed", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.message,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch({ type: MENU_OPEN, id: "Clustered" });
    CheckReloadCluster();
    GetCompainesName();
  }, []);

  return (
    <>
      {/* <MainCard title="Clustered Matches" className="main_card"> */}
      <FormControl
        className="upperPart"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography className="company_filter"> Company Filter </Typography>
        <Autocomplete
          autoHighlight
          name="company"
          options={options}
          getOptionLabel={(option) => option || ""}
          clearIcon={<></>} //One Benefit, their is no need to give functionality on clear button(only onChange)
          onChange={(_, newValue) => {
            // console.log(newValue, "hello");
            setClData({});
            setPage(0);
            if (newValue) {
              if (company) {
                DeleteLockedUser(company, newValue);
              } else {
                IsFileLocked(newValue);
              }
            }
            setCompany(newValue || "");
          }}
          value={options.find((item) => item === company) || null}
          isOptionEqualToValue={(option, value) => {
            if (value) {
              return option === value;
            }
            return false;
          }}
          renderOption={(prop, option) => <li {...prop}>{option}</li>}
          renderInput={(params) => (
            <TextField
              {...params}
              // label="Select company"
              variant="outlined"
              className="selectbar"
              placeholder="Select company"
              sx={{ width: "300px", ml: 5 }}
            />
          )}
          key={(option) => option}
          noOptionsText="No Results Found"
        />
        <Button
          size="large"
          variant="contained"
          color="secondary"
          style={{
            marginLeft: "10px",
            background: "#40434E",
            padding: "12px 20px",
            borderRadius: "15px",
            color: "white",
          }}
          onClick={() => {
            setClData({});
            if (company) {
              DeleteLockedUser(company);
            }
            setCompany(null);
          }}
        >
          CLEAR
        </Button>

        {reloadCheck !== 0 && (
          <Button
            size="large"
            variant="contained"
            color="secondary"
            style={{
              marginLeft: "auto",
              background: "#E11927",
              padding: "12px 20px",
              borderRadius: "15px",
              color: "white",
            }}
            onClick={() => {
              RefreshAllClusterFiles();
            }}
          >
            <IoMdRefresh fontSize={22} /> &nbsp; RELOAD
          </Button>
        )}
      </FormControl>

      <TableContainer
        className="custom-scrollbar"
        component={Paper}
        sx={{ overflowX: "auto" }}
      >
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow className="custom-scrollbar">
              <TableCell sx={{ bgcolor: "#40434E", color: "#fff", textAlign: "center"}}>
                #
              </TableCell>
              <TableCell
                align="center"
                sx={{ bgcolor: "#40434E", color: "#fff" }}
              >
                Manufacturer Id
              </TableCell>
              <TableCell
                align="center"
                sx={{ bgcolor: "#40434E", color: "#fff" }}
              >
                MCN
              </TableCell>
              <TableCell
                align="center"
                sx={{ bgcolor: "#40434E", color: "#fff" }}
              >
                ItemDescription
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {console.log("original ", clData)} */}
            {clData && Object.keys(clData).length > 0 ? (
              Object.keys(clData)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((matchingKey, index) => {
                  let parent_id = "";
                  let outerObject = {};
                  let innerArray = [];

                  try {
                    // GET PARENT ID
                    parent_id = matchingKey.match(/parent_id:(\d+)/);
                    parent_id = parent_id[1];

                    // GET OBJECT FROM KEY
                    const match = matchingKey.match(/\{(.+?)\}/);
                    const objectString = match[0];
                    // Convert the object string to a valid JSON format
                    const validJsonString = objectString.replace(/'/g, '"');
                    // Parse the JSON string to get the object
                    outerObject = JSON.parse(validJsonString);

                    //  GET ARRAY FROM KEY
                    innerArray = Array.isArray(clData[matchingKey])
                      ? clData[matchingKey]
                      : [];
                  } catch (error) {
                    // console.log("matching key", matchingKey);
                    console.log("error ", error);
                  }

                  return (
                    <Row
                      key={parent_id}
                      parent_id={parent_id}
                      outerObject={outerObject}
                      defaultArray={innerArray}
                      index={serialNumber(page, index)}
                      company={company}
                      GetCompanyData={GetCompanyData}
                    />
                  );
                })
            ) : (
              <TableRow>
                <TableCell style={{ textAlign: "center" }} colSpan={6}>
                  Please select a company first.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        className="pagination"
        rowsPerPageOptions={[50, 100]}
        component="div"
        count={Object.keys(clData).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </>
    // </MainCard>
  );
};

export default ClusteredMatches;
