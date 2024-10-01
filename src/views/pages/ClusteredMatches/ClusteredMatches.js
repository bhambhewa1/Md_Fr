import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { MENU_OPEN } from "store/actions";
import MainCard from "ui-component/cards/MainCard";
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
  TableSortLabel,
  TextField,
} from "@mui/material";
import "./style.css";
import Axios from "api/Axios";
import { API } from "api/API";
import CustomPaper from "ui-component/components/CustomPaper";
import Loading from "ui-component/components/Loading";
import Message from "ui-component/components/Snackbar/Snackbar";
import Row from "./Row";

const ClusteredMatches = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [options, setOptions] = useState([]);
  const [clData, setClData] = useState({});
  const [paginationData, setPaginationData] = useState({});
  const [company, setCompany] = useState(
    JSON.parse(localStorage.getItem("Clustered_Company"))?.company
  );
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(
    JSON.parse(localStorage.getItem("Clustered_Company"))?.selectedBatch || {}
  );

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

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    // await GetCompanyData(company, newPage);
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

  const handleClear = () => {
    removeSelectedBatch();
    localStorage.removeItem("Clustered_Company");
    setClData([]);
    setBatches([]);
    console.log("selectedBatch", selectedBatch);
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
        categoryFlag: "Clustered",
      });
      if (res) {
        // console.log("profile", res.data)
        setOptions(res?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in fetching Companies Names", error);
      setIsLoading(false);
      setSnackbar({
        open: true,
        severity: "error",
        // message: error.message,
        message:
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message,
      });
    }
  };

  const GetBatchesName = async (newCompany) => {
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Batches_Api, {
        ticker: newCompany,
        categoryFlag: "Clustered",
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

  // number? number: page
  const GetCompanyData = async (number) => {
    try {
      setIsLoading(true);
      const res = await Axios.post(`${API.Get_Company_Data}?page=${page}`, {
        filename: company,
        batchId: selectedBatch?.batchId,
        category_flag: "Clustered",
        email: Details.email,
        ManufacturerCatalogNumber:
          orderBy === "MCN" && order !== "asc" ? true : false,
        ItemDescription:
          orderBy === "ItemDescription" && order !== "asc" ? true : false,
      });
      // console.log("hel",res)
      if (res?.data) {
        // console.log("clData", res?.data?.tickerData);
        if (!Array.isArray(res?.data?.tickerData)) {
          throw new Error("Data coming in wrong format!");
        }
        setClData(res?.data?.tickerData);
        setPaginationData(res?.data?.pagination);
        // setPage(res?.data?.pagination?.currentPage)
        // if ( res?.data?.length === 0) {
        //   GetCompaniesName();
        // }
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in fetching Company Data", error);
      setIsLoading(false);
      setClData([]);
      localStorage.removeItem("Clustered_Company");
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
        category_flag: "Clustered",
        batchId: newBatch?.batchId,
      });
      if (res?.data) {
        if (res.data.success) {
          localStorage.setItem(
            "Clustered_Company",
            JSON.stringify({ selectedBatch: newBatch, company })
          );
          // GetCompanyData(newCompany, page);
        } else {
          setSnackbar({
            open: true,
            severity: "error",
            message: res.data.message,
          });
          // setCompany("");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log("ERROR in storing user for current file locked", error);
      setIsLoading(false);
      setSnackbar({
        open: true,
        severity: "error",
        // message: error?.message
        message:
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message,
      });
    }
  };

  const DeleteLockedUser = async (perviousBatch, newBatch) => {
    // const profile = JSON.parse(localStorage.getItem("Profile_Details"));
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Delete_User_Locked, {
        email: Details.email,
        company_name: company,
        category_flag: "Clustered",
        batchId: perviousBatch?.batchId,
      });
      if (res?.data) {
        //   // console.log("delete locked user", res.data);
        //   if (newBatch) {
        //     IsFileLocked(newBatch);
        //   } else {
        setIsLoading(false);
        // }
      }
    } catch (error) {
      console.log("ERROR in deleting user locked, if file closed", error);
      setSnackbar({
        open: true,
        severity: "error",
        // message: error?.message
        message:
          error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message,
      });
      setIsLoading(false);
    }
  };

  const handleRequestSort = async (property) => {
    // console.log(property)
    // let orderValue = "";
    if (orderBy === property) {
      const isAsc = order === "asc";
      // orderValue = isAsc ? 'desc' : 'asc';
      setOrder(isAsc ? "desc" : "asc");
    } else {
      // orderValue = 'desc';
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

  useEffect(() => {
    dispatch({ type: MENU_OPEN, id: "Clustered" });
    GetCompaniesName();
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
            // if (newValue) {
            if (Object.keys(selectedBatch).length > 0) {
              DeleteLockedUser(selectedBatch);
            }
            localStorage.removeItem("Clustered_Company");
            setBatches([]);
            setClData([]);
            setSelectedBatch({});
            setPage(1);
            setCompany(newValue || "");
            // GetBatchesName(newValue);
            // }
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
            // else {
            //   IsFileLocked(newValue);
            // }
            // }
            setSelectedBatch(newValue);
          }}
          value={selectedBatch}
          PaperComponent={CustomPaper}
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
            handleClear();
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
                {clData.length > 1 && (
                  <TableSortLabel
                    className="sortLabel"
                    active={true}
                    direction={orderBy === "MCN" ? order : "asc"}
                    // onClick={createSortHandler("MCN")}
                    onClick={() => {
                      handleRequestSort("MCN");
                    }}
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
                  active={true}
                  direction={orderBy === "ItemDescription" ? order : "asc"}
                  // onClick={createSortHandler("ItemDescription")}
                  onClick={() => {
                    handleRequestSort("ItemDescription")
                  }}
                /> */}
              </TableCell>
              <TableCell
                align="center"
                sx={{ bgcolor: "#40434E", color: "#fff" }}
              >
                T-Count
              </TableCell>
              <TableCell
                align="center"
                sx={{ bgcolor: "#40434E", color: "#fff" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {console.log("original ", clData)} */}

            {clData && clData.length > 0 ? (
              clData
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => {
                  let parent_id = item?._id;
                  let batchId = item?.batchId;
                  let outerObject = item?.data;
                  const innerArray = item?.data?.Clustered_point;

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
                      // setPage={setPage}
                      setPage={
                        page !== 1 && clData.length === 1 ? setPage : "samePage"
                      }
                      GetCompanyData={GetCompanyData}
                      // clData={clData}
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
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </>
    // </MainCard>
  );
};

export default ClusteredMatches;
