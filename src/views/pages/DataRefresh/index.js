import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { MENU_OPEN, TICKER_APPROVE_UPDATE_DATA, TICKER_DISAPPROVE_UPDATE_DATA } from "store/actions";
import MainCard from "ui-component/cards/MainCard";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import "../ClusteredMatches/style.css";
import {
  Autocomplete,
  Button,
  FormControl,
  IconButton,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { IoMdRefresh } from "react-icons/io";
import Loading from "ui-component/components/Loading";
import LongMenu from "ui-component/menu-cluster/ClusterMenu";
import Popup from "ui-component/components/Popup";
import { FcApproval, FcDisapprove } from "react-icons/fc";
import { GoDotFill } from "react-icons/go";
import Message from "ui-component/components/Snackbar/Snackbar";
import Axios from "api/Axios";
import { API } from "api/API";
import { EventsAPIs } from "utils/global_functions";
import { FORCE_RELOAD_UPDATE_DATA } from "store/actions";

const columns = [
  { id: "fetch_date", columnKey: "fetch_date", label: "Date" },
  {
    id: "total_record_fetch",
    columnKey: "total_record_fetch",
    label: "Records",
  },
  { id: "status", columnKey: "status", label: "Status" },
  { id: "action", columnKey: "action", label: "Actions" },
];

const CustomPaper = (props) => (
  <Paper
    {...props}
    style={{
      boxShadow:
        "0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)",
    }}
  />
);

const DataRefresh = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [reloadCheck, setReloadCheck] = useState(0);
  const [companyData, setCompanyData] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(JSON.parse(localStorage.getItem("DataRefresh_Company"))?.status || "All")
  const [company, setCompany] = useState(JSON.parse(localStorage.getItem("DataRefresh_Company"))?.company || "");
  const [paginationData, setPaginationData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [UniqueDate, setUniqueDate] = useState(null);
  const [popupOpen, setPopupOpen] = useState({
    open: false,
    type: "",
  });
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // GetCompanyData(company, newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const serialNumber = (page, index) => {
    // return page * rowsPerPage + index + 1;
    return (page - 1) * paginationData?.rowPerPage + index + 1;
  };

  const handleMenuClose = () => {
    setUniqueDate(null);
    setAnchorEl(null);
  };

  const CheckReloadCluster = async () => {
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Check_Reload_Status);
      if (res?.data) {
        // console.log("Check reload", res.data)
        if (res.data) {
          setReloadCheck(parseInt(res.data.status));
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
        message:
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message,
      });
      setIsLoading(false);
    }
  };

  const RefreshAllFiles = async () => {
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Reload_Transfer_Data);
      if (res?.data) {
        // console.log("refesh", res.data)
        setSnackbar({
          open: true,
          message: res?.data?.message,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in fetching all new clustered files", error);
      setSnackbar({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message,
      });
      setIsLoading(false);
    }
  };

  const GetCompaniesName = async () => {
    try {
      setIsLoading(true);
      const status = selectedStatus === "All" ? undefined : selectedStatus === "Loaded" ? "Approve" : selectedStatus === "Not Loaded" ? "Disapprove" : selectedStatus; 
      const res = await Axios.post(API.DataRefresh_Companies,{status});
      if (res?.data) {
        // console.log("profile", res.data)
        setOptions(res?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in fetching Companies Names", error);
      setSnackbar({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message,
      });
      setIsLoading(false);
    }
  };

  const GetCompanyData = async () => {
    try {
      setIsLoading(true);
      const status = selectedStatus === "All" ? undefined : selectedStatus === "Loaded" ? "Approve" : selectedStatus === "Not Loaded" ? "Disapprove" : selectedStatus; 
      const res = await Axios.post(
        `${API.DataRefresh_companiesData}?page=${page}`,
        { status, ticker: company }
      );
      if (res?.data) {
        // console.log("data", res?.data?.pagination)
        setCompanyData(res?.data?.data);
        setPaginationData(res?.data?.pagination);
        // if (res?.data?.data.length === 0) {
        //   setSnackbar({
        //     open: true,
        //     message: "Only pending records visible",
        //   });
        //   }
        setIsLoading(false);
        setTimeout(() => {
          CheckReloadCluster(); // While fetching data on Update data screen, checking for force reload condition
        },1000)
      }
    } catch (error) {
      console.log("ERROR in fetching Companies approved data", error);
      setSnackbar({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message,
      });
      setIsLoading(false);
      setCompanyData([]);
    }
  };

  const approveAPI = async () => {
    let data = {
      ticker: company,
      created_date: UniqueDate
    };
    try {
      setIsLoading(true);
      const res = await Axios.post(API.DataRefresh_Approve, data);
      if (res?.data) {
        setSnackbar({
          open: true,
          message: res.data.message,
        });
        GetCompanyData();
        // setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in approve or save&approve file", error);
      setSnackbar({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message,
      });
      setIsLoading(false);
    }
  };

  const disapprovedAPI = async () => {
    let data = {
      ticker: company,
      created_date: UniqueDate,
      email: JSON.parse(localStorage.getItem("Profile_Details"))?.email,
    };
    try {
      setIsLoading(true);
      const res = await Axios.post(API.DataRefresh_Disapprove, data);
      if (res?.data) {
        setSnackbar({
          open: true,
          message: res.data.message,
        });
        GetCompanyData();
        // setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in approve or save&approve file", error);
      setSnackbar({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message,
      });
      setIsLoading(false);
    }
  };

  const getDateOnly = (datetimeString) => {
    return datetimeString.split("T")[0];
  };

  useEffect(() => {
    // dispatch({ type: MENU_OPEN, id: "Reload_Data" });
    // GetCompaniesName();
    if (company) {
      setTimeout(() => {
        GetCompanyData();
      }, 500);
    }
  }, [company, page]);

  useEffect(() => {
    dispatch({ type: MENU_OPEN, id: "Reload_Data" });
    if(selectedStatus){
      CheckReloadCluster();
      GetCompaniesName();
    }
  }, [selectedStatus]);

  return (
    <>
      {/* <MainCard title="Approved Matches"> */}

      <FormControl
        className="upperPart"
        fullWidth
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography className="company_filter"> Status </Typography>
        <Autocomplete
          fullWidth
          name="status"
          disableClearable
          options={["All", "Pending", "Loaded", "Not Loaded"]}
          getOptionLabel={(option) => option || ""}
          onChange={(_, newValue) => {
            // console.log(newValue, "hello");
            setSelectedStatus(newValue);
            setCompanyData([]);
            setCompany("");
            localStorage.setItem("DataRefresh_Company", JSON.stringify({status: newValue}));
            setSnackbar({
              open: true,
              severity: "warning",
              message: "Companies list loaded in the Company Filter. Please select a company."
            })
          }}
          value={selectedStatus}
          isOptionEqualToValue={(option, value) => {
            if (value) {
              return option === value;
            }
            return false;
          }}
          PaperComponent={CustomPaper}
          renderOption={(prop, option) => <li {...prop}>{option} </li>}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              className="selectbar"
              placeholder="Select status"
              sx={{ ml: 1 }}
            />
          )}
          key={(option) => option}
          noOptionsText="No Results Found"
        />



        <Typography className="company_filter" sx={{ml:3, minWidth: {xs: "123px"} }}> Company Filter </Typography>
        <Autocomplete
          autoHighlight
          fullWidth
          name="company"
          disableClearable
          options={options}
          getOptionLabel={(option) => option || ""}
          onChange={(_, newValue) => {
            // console.log(newValue, "hello");
            setCompanyData([]);
            setCompany(newValue);
            localStorage.setItem("DataRefresh_Company", JSON.stringify({status:selectedStatus, company:newValue}));
            setPage(1);
          }}
          // value={options.find((item) => item === company) || null}
          value={company}
          isOptionEqualToValue={(option, value) => {
            if (value) {
              return option === value;
            }
            return false;
          }}
          PaperComponent={CustomPaper}
          renderOption={(prop, option) => <li {...prop}>{option} </li>}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              className="selectbar"
              placeholder="Select company"
              sx={{ ml: 1 }}
            />
          )}
          key={(option) => option}
          noOptionsText="No Results Found"
        />

        <Button
          size="large"
          variant="contained"
          color="secondary"
          disableRipple
          disableElevation
          sx={{
            marginLeft: {xs:3,lg:7},
            padding: "12px 20px",
            borderRadius: "15px",
            color: "white",
            background: "#40434E",
            ':hover': {
              background: "#40434E",
            }
          }}
          onClick={() => {
            setCompanyData([]);
            localStorage.removeItem("DataRefresh_Company");
            setCompany("");
            setSelectedStatus("All");
            setPaginationData(null);
            setPage(1)
          }}
        >
          CLEAR
        </Button>

        {reloadCheck !== 0 && (
          <Button
            disabled={isLoading}
            size="large"
            variant="contained"
            color="secondary"
            disableRipple
            disableElevation
            sx={{
              ml: "20px",
              minWidth: {xs:"170px",},
              padding: "12px 15px",
              borderRadius: "15px",
              color: "white",
              background: "#E11927",
              ':hover': {
                background: "#E11927",
              }
            }}
            onClick={async() => {
              await RefreshAllFiles();
              await EventsAPIs('',FORCE_RELOAD_UPDATE_DATA)
              setTimeout(() => {
                CheckReloadCluster();
              }, 1000)

            }}
          >
            <IoMdRefresh fontSize={22} /> &nbsp; FORCE RELOAD
          </Button>
        )}
      </FormControl>

      <Paper sx={{ width: "100%", overflow: "hidden", mb: "40px", pb: 3 }}>
        <TableContainer
          className="custom-scrollbar"
          style={{ overflowX: "auto", marginBottom: "0px" }}
        >
          <Table
            // className="custom-scrollbar"
            stickyHeader
            aria-label="sticky table"
          >
            <TableHead>
              <TableRow className="custom-scrollbar">
                <TableCell className="global_table"
                  align="center"
                  style={{
                    backgroundColor: "#40434E",
                    color: "#fff",
                    top: "auto",
                  }}
                >
                  #
                </TableCell>

                {columns.map((column) => (
                  <TableCell className="global_table"
                    key={column.id}
                    align="center"
                    style={{
                      backgroundColor: "#40434E",
                      color: "#fff",
                      top: "auto",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {companyData && companyData.length > 0 ? (
                companyData
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((rowData, index) => {
                    return (
                      <TableRow className="custom-scrollbar" key={index}>
                        <TableCell className="global_table" align="center">
                          {serialNumber(page, index)}
                        </TableCell>

                        {columns &&
                          columns.slice(0, -1).map((column) => (
                            <TableCell className="global_table" key={column.id} align="center">
                            {column.id === "fetch_date"
                              ? getDateOnly(rowData[column.columnKey])
                              : (column.id === "status" && rowData[column.columnKey] === "Approve" || rowData[column.columnKey] === "Approved")
                              ? "Loaded"
                              : (column.id === "status" && rowData[column.columnKey] === "Disapprove" || rowData[column.columnKey] === "Disapproved")
                              ? "Not Loaded"
                              : rowData[column.columnKey]}
                          </TableCell>
                          ))}

                        <TableCell className="global_table" align="center">
                          <IconButton
                            disabled={isLoading ||
                              rowData?.status.toLowerCase() === "approve" ||
                              rowData?.status.toLowerCase() === "approved" ||
                              rowData?.status.toLowerCase() === "disapprove" ||
                              rowData?.status.toLowerCase() === "disapproved"
                            }
                            onClick={(event) => {
                              // setArrayIndex(ind); // array index set
                              setUniqueDate(rowData?.fetch_date); // UniqueDate set
                              setAnchorEl(event.currentTarget);
                            }}
                          >
                            <IoEllipsisVerticalSharp
                              style={{
                                cursor: "pointer",
                                fontSize: "17px",
                              }}
                            />
                          </IconButton>

                          {/* {popupOpen.open && (
                            <Popup
                              open={popupOpen.open}
                              overflowY="auto"
                              height="220px"
                              outerBoxClass="outerBoxClass"
                              titleClass="titleClass"
                              contentClass="contentClass"
                              title="Alert"
                              content="Are you sure you want to proceed?"
                              actions={
                                <>
                                  <Button
                                    className="popupCancel"
                                    onClick={() => {
                                      setPopupOpen({ open: false });
                                      handleMenuClose();
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    className="popupConfirm"
                                    onClick={() => {
                                      // Popup for already exiting row on Approve button
                                      if (popupOpen.type === "Approve") {
                                        approveAPI()
                                      }
                                      // Popup for editing row on save & approve Confirm button
                                      if (popupOpen.type === "Disapprove") {
                                        disapprovedAPI();
                                      }
                                      // For close popup and menu's and reset count of add or edit row
                                      setPopupOpen({ open: false });
                                      handleMenuClose();
                                    }}
                                  >
                                    Confirm
                                  </Button>
                                </>
                              }
                            />
                          )} */}
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell className="global_table" style={{ textAlign: "center" }} colSpan={5}>
                  {company ? "No Record Found" : "Please select a company first."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* {paginationData?.totalPages > 1 && (
            <Pagination
              count={paginationData?.totalPages}
              defaultPage={1}
              page={page}
              onChange={handleChangePage}
              siblingCount={1}
              boundaryCount={1}
              color="primary"
              className="pagination"
              sx={{
                mt: 3,
                width: "100%",
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            />
          )} */}
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[50, 100]}
          component="div"
          count={companyData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
        {companyData.length > 0 && paginationData?.totalPages > 1 && (
          <Pagination
            count={paginationData?.totalPages}
            defaultPage={1}
            page={page}
            onChange={handleChangePage}
            siblingCount={1}
            boundaryCount={1}
            color="primary"
            className="pagination"
            sx={{
              mt: 3,
              width: "100%",
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
            }}
          />
        )}
      </Paper>
      {anchorEl && (
        <LongMenu
          anchorEl={anchorEl}
          handleClose={handleMenuClose}
          Items={[
            {
              text: (
                <>
                  <FcApproval fontSize={19} />
                  &nbsp; Load Records
                </>
              ),
              onClick: async() => {
                setPopupOpen({
                  open: true,
                  type: "Approve",
                });
                await EventsAPIs('',TICKER_APPROVE_UPDATE_DATA)

              },
            },
            {
              text: (
                <>
                  <FcDisapprove fontSize={22} />
                  &nbsp; Do Not Load Records
                </>
              ),
              onClick: async() => {
                setPopupOpen({
                  open: true,
                  type: "Disapprove",
                });
                await EventsAPIs('',TICKER_DISAPPROVE_UPDATE_DATA)

              },
            },
          ]}
        />
      )}

      {popupOpen.open && (
        <Popup
          open={popupOpen.open}
          overflowY="auto"
          height="220px"
          outerBoxClass="outerBoxClass"
          titleClass="titleClass"
          contentClass="contentClass"
          title="Alert"
          content="Are you sure you want to proceed?"
          actions={
            <>
              <Button
                className="popupCancel"
                onClick={() => {
                  setPopupOpen({ open: false });
                  handleMenuClose();
                }}
              >
                Cancel
              </Button>
              <Button
                className="popupConfirm"
                onClick={() => {
                  // Popup for already exiting row on Approve button
                  if (popupOpen.type === "Approve") {
                    approveAPI();
                  }
                  // Popup for editing row on save & approve Confirm button
                  if (popupOpen.type === "Disapprove") {
                    disapprovedAPI();
                  }
                  // For close popup and menu's and reset count of add or edit row
                  setPopupOpen({ open: false });
                  handleMenuClose();
                }}
              >
                Confirm
              </Button>
            </>
          }
        />
      )}
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
      {/* </MainCard> */}
    </>
  );
};

export default DataRefresh;
