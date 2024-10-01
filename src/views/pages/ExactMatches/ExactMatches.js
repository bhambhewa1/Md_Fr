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

import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  Pagination,
  TablePagination,
  TableSortLabel,
  TextField,
} from "@mui/material";
import "../ClusteredMatches/style.css";
import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "ui-component/components/Loading";
import Message from "ui-component/components/Snackbar/Snackbar";
import Row from "./Row";
import { object } from "prop-types";

const CustomPaper = (props) => (
  <Paper
    {...props}
    style={{
      boxShadow:
        "0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)",
    }}
  />
);

const ExactMatches = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [options, setOptions] = useState([]);
  const [clData, setClData] = useState();
  const [paginationData, setPaginationData] = useState({});
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(
    JSON.parse(localStorage.getItem("Exact_Company"))?.selectedBatch || {}
  );

  const [company, setCompany] = useState(
    JSON.parse(localStorage.getItem("Exact_Company"))?.company
  );
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  const dispatch = useDispatch();
  const Profile_Details = localStorage.getItem("Profile_Details");
  const Details = JSON.parse(Profile_Details);

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
    return (page - 1) * paginationData?.rowperpage + index + 1;
  };

  const removeSelectedBatch = () => {
    setSelectedBatch({});
  };

  const handleClear = async () => {
    removeSelectedBatch();
    localStorage.removeItem("Exact_Company");
    setClData([]);
    setBatches([]);
    if (Object.keys(selectedBatch).length > 0) {
      DeleteLockedUser(selectedBatch);
    }
    setCompany(null);
    setPaginationData(null);
  };

  const GetCompaniesName = async () => {
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Companies_Name, {
        categoryFlag: "Exact",
      });
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
        message:
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message,
      });
      setIsLoading(false);
    }
  };

  const GetBatchesName = async (newCompany) => {
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Batches_Api, {
        ticker: newCompany,
        categoryFlag: "Exact",
      });
      if (res && res.data) {
        const batchesData = res.data.map((batch) => ({
          batchId: batch.batchId,
          batchName: batch.batchName,
        }));
        setBatches(batchesData);
        if (Object.keys(selectedBatch).length <= 0) {
          setSelectedBatch(batchesData[0] || {});
        }
        // if(Object.keys(selectedBatch).length > 0){
        //   GetCompanyData();
        // }
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in fetching Batches Names", error);
      setIsLoading(false);
      setSnackbar({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message,
      });
    }
  };

  const GetCompanyData = async () => {
    try {
      setIsLoading(true);
      const res = await Axios.post(`${API.Get_Company_Data}?page=${page}`, {
        filename: company,
        batchId: selectedBatch?.batchId,
        category_flag: "Exact",
        email: Details.email,
        ManufacturerCatalogNumber:
          orderBy === "MCN" && order !== "asc" ? true : false,
        ItemDescription:
          orderBy === "ItemDescription" && order !== "asc" ? true : false,
      });
      if (res?.data) {
        // console.log("clData", res?.data?.tickerData);
        if (!Array.isArray(res?.data?.tickerData)) {
          throw new Error("Data coming in wrong format!");
        }
        setClData(res?.data?.tickerData);
        setPaginationData(res?.data?.pagination);
        // setPage(res?.data?.pagination?.currentPage)
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in fetching Company Data", error.response.status);
      setIsLoading(false);
      localStorage.removeItem("Exact_Company");
      setClData([]);
      setSnackbar({
        open: true,
        severity: "error",
        autoHideDuration: 6000,
        message:
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message,
      });
    }
  };

  const IsFileLocked = async (newBatch) => {
    try {
      setIsLoading(true);
      const res = await Axios.post(API.File_Locked, {
        email: Details.email,
        company_name: company,
        name: Details.name,
        category_flag: "Exact",
        batchId: newBatch?.batchId,
      });
      if (res?.data) {
        if (res.data.success) {
          localStorage.setItem(
            "Exact_Company",
            JSON.stringify({ selectedBatch: newBatch, company })
          );
          // GetCompanyData(newCompany, page);
        } else {
          setSnackbar({
            open: true,
            severity: "error",
            message: res?.data?.message,
          });
          setCompany("");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log("ERROR in storing user for current file locked", error);
      setIsLoading(false);
      setSnackbar({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message,
      });
    }
  };

  const DeleteLockedUser = async (perviousBatch, newBatch) => {
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Delete_User_Locked, {
        email: Details.email,
        batchId: perviousBatch?.batchId,
        company_name: company,
        category_flag: "Exact",
      });
      if (res?.data) {
        // console.log("delete locked user", res.data);
        // if (newBatch) {
        //   IsFileLocked(newBatch);
        // } else {
        setIsLoading(false);
        // }
      }
    } catch (error) {
      console.log("ERROR in deleting user locked, if file closed", error);
      setIsLoading(false);
      setSnackbar({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message,
      });
    }
  };

  const handleRequestSort = async (property) => {
    // console.log(property)
    let orderValue = "";
    if (orderBy === property) {
      const isAsc = order === "asc";
      orderValue = isAsc ? "desc" : "asc";
      setOrder(orderValue);
    } else {
      orderValue = "desc";
      setOrder("desc");
      setOrderBy(property);
    }
    // await GetCompanyData(company, page, property, orderValue);

    // const isAsc = orderBy === property && order === 'asc';
    // // console.log("order",isAsc)
    // setOrder(isAsc ? 'desc' : 'asc');
    // setOrderBy(property);
  };

  useEffect(() => {
    if (Object.keys(selectedBatch).length > 0) {
      GetCompanyData();
    }
  }, [page, order, orderBy]);

  useEffect(() => {
    if (Object.keys(selectedBatch).length > 0) {
      IsFileLocked(selectedBatch);
      GetCompanyData();
    }
  }, [selectedBatch]);

  useEffect(() => {
    if (company) {
      setTimeout(() => {
        GetBatchesName(company);
        // GetCompanyData();
      }, 500);
    }
  }, [company]);

  // useEffect(() => {
  //   if (company) {
  //     setTimeout(() => {
  //       GetCompanyData();
  //       GetBatchesName(company);
  //     }, 500);
  //   }
  // }, [company, page, order, orderBy]);

  useEffect(() => {
    dispatch({ type: MENU_OPEN, id: "Exact_Matches" });
    GetCompaniesName();
    // setTimeout(() => {
    //   if (company) {
    //     IsFileLocked(company);
    //   }
    // }, 500);
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
          mb: 3,
        }}
      >
        <Typography className="company_filter"> Company Filter </Typography>
        <Autocomplete
          autoHighlight
          name="company"
          options={options}
          getOptionLabel={(option) => option || ""}
          disableClearable
          onChange={(_, newValue) => {
            // console.log(newValue, "hello");
            if (Object.keys(selectedBatch).length > 0) {
              DeleteLockedUser(selectedBatch);
            }
            localStorage.removeItem("Exact_Company");
            setBatches([]);
            setClData([]);
            setPage(1);
            setSelectedBatch({});
            setCompany(newValue || "");
            // GetBatchesName(newValue)
          }}
          value={options.find((item) => item === company) || null}
          isOptionEqualToValue={(option, value) => {
            if (value) {
              return option === value;
            }
            return false;
          }}
          PaperComponent={CustomPaper}
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
        <Typography className="company_filter" sx={{ ml: 2 }}>
          Batches
        </Typography>

        <Autocomplete
          disableClearable
          id="batch-autocomplete"
          options={batches}
          getOptionLabel={(option) => option?.batchName || ""}
          onChange={(e, newValue) => {
            setClData([]);
            setPage(1);
            // if (newValue) {
            if (Object.keys(selectedBatch).length > 0) {
              DeleteLockedUser(selectedBatch, newValue);
            }
            //    else {
            //     IsFileLocked(newValue);
            //   }
            // }
            setSelectedBatch(newValue);
          }}
          value={selectedBatch}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              className="selectbar"
              placeholder="Select batches"
              sx={{ width: "300px", ml: 3 }}
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
            if (company) {
              handleClear();
            }
          }}
        >
          CLEAR
        </Button>
      </FormControl>

      <TableContainer
        className="custom-scrollbar"
        component={Paper}
        sx={{ overflowX: "auto" }}
      >
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow className="custom-scrollbar">
              <TableCell
                sx={{ bgcolor: "#40434E", color: "#fff", textAlign: "center" }}
              >
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
                {clData?.length > 1 && (
                  <TableSortLabel
                    className="sortLabel"
                    active
                    direction={orderBy === "MCN" ? order : "asc"}
                    // onClick={createSortHandler("MCN")}
                    onClick={() => handleRequestSort("MCN")}
                  />
                )}
              </TableCell>
              <TableCell
                align="center"
                sx={{ bgcolor: "#40434E", color: "#fff" }}
              >
                Item Description
                {/* <TableSortLabel
                  // active={column.columnKey === "ItemDescription"}
                  active
                  direction={orderBy === "ItemDescription" ? order : "asc"}
                  onClick={() => handleRequestSort("ItemDescription")}
                /> */}
              </TableCell>
              <TableCell
                align="center"
                sx={{ bgcolor: "#40434E", color: "#fff" }}
              >
                T-Count
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {console.log("original ", clData)} */}

            {clData && clData?.length > 0 ? (
              clData
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => {
                  let parent_id = item?._id;
                  let batchId = item.batchId;
                  let outerObject = item?.data;
                  let innerArray = [];
                  innerArray.push(item?.data?.Exact_point);

                  return (
                    <Row
                      key={parent_id}
                      parent_id={parent_id}
                      batchId={batchId}
                      outerObject={outerObject}
                      defaultArray={innerArray}
                      index={serialNumber(page, index)}
                      // company={company}
                      page={page}
                      setPage={
                        page !== 1 && clData?.length === 1
                          ? setPage
                          : "samePage"
                      }
                      GetCompanyData={GetCompanyData}
                    />
                  );
                })
            ) : (
              <TableRow>
                <TableCell style={{ textAlign: "center" }} colSpan={6}>
                  {company
                    ? "No Record Found"
                    : "Please select a company first."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {clData?.length > 0 && paginationData?.totalPages > 1 && (
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
      </TableContainer>

      {/* <TablePagination
        className="pagination"
        rowsPerPageOptions={[50, 100]}
        component="div"
        count={Object.keys(clData).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
      {/* {paginationData?.totalPages > 1 && */}
      {/* <Pagination
        count={paginationData?.totalPages}
        defaultPage={1}
        page={page}
        onChange={handleChangePage}
        siblingCount={1}
        boundaryCount={1}
        color="primary"
        className="pagination"
        sx={{
          button: { mt: 3, mb: 3 },
          width: "100%",
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
        }}
      /> */}
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </>
    // </MainCard>
  );
};

export default ExactMatches;
