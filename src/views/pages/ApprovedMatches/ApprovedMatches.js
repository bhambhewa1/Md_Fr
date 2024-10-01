import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  DISCARD_CHANGES_APPROVED,
  EDIT_ROW_APPROVED,
  MENU_OPEN,
  SAVE_APPROVE_ROW_EXACT,
  SAVE_ROW_APPROVED,
} from "store/actions";
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
import "../ApprovedMatches/Approvedmatches.css";

import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  ClickAwayListener,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Pagination,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import BaseTextareaAutosize from "@mui/base/TextareaAutosize";
import Loading from "ui-component/components/Loading";
import Message from "ui-component/components/Snackbar/Snackbar";
import Axios from "api/Axios";
import { API } from "api/API";
import LongMenu from "ui-component/menu-cluster/ClusterMenu";
import { BiSearchAlt2, BiSolidEdit } from "react-icons/bi";
import { FiSave } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/system";
import { EventsAPIs, removeSpacesAndNonASCII } from "utils/global_functions";
import { IoMdClose } from "react-icons/io";
import CustomPaper from "ui-component/components/CustomPaper";

const columns = [
  { id: "mf_id", columnKey: "ManufacturerId", label: "Manufacturer Id" },
  {
    id: "mf_catlog",
    columnKey: "ManufacturerCatalogNumber",
    label: "MCN",
  },
  {
    id: "item_desc",
    columnKey: "ItemDescription",
    label: "Item Description",
  },
  { id: "group", columnKey: "Group", label: "Group" },
  { id: "business", columnKey: "Business", label: "Business" },
  { id: "division", columnKey: "Division", label: "Division" },
  { id: "therapy", columnKey: "Therapy", label: "Therapy" },
  { id: "specialty", columnKey: "Specialty", label: "Specialty" },
  { id: "anatomy", columnKey: "Anatomy", label: "Anatomy" },
  { id: "sub_anatomy", columnKey: "SubAnatomy", label: "SubAnatomy" },
  {
    id: "prod_category",
    columnKey: "ProductCategory",
    label: "ProductCategory",
  },
  { id: "prod_family", columnKey: "ProductFamily", label: "ProductFamily" },
  { id: "model", columnKey: "Model", label: "Model" },
  { id: "prod_code", columnKey: "productCode", label: "ProductCode" },
  {
    id: "prod_code_name",
    columnKey: "productCodeName",
    label: "ProductCodeName",
  },
  { id: "comment", columnKey: "comment", label: "Notes" },
  { id: "action", columnKey: "action", label: "Actions" },
];

const useStyles = makeStyles((theme) => ({
  Autocomplete: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  textField: {
    "&.MuiFormControl-root": {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
    },
    "&.MuiTextField-root": {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
    },
    // Below two style are same level components
    "& .MuiInputBase-root": {
      borderRadius: 0,
      // background: "green"
    },
    "& .MuiOutlinedInput-root": {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      "& fieldset": {
        // borderColor: "transparent",
        border: "none",
        color: "#333",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #1a73e8",
        borderRadius: "0px",
        textAlign: "center",
      },
    },
  },
}));

const CustomPaperEdit = (props) => (
  <Paper {...props} style={{ backgroundColor: "#DFDFDF" }} />
);

const ApprovedMatches = () => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [approveData, setApproveData] = useState([]);
  const [options, setOptions] = useState([]);
  const [company, setCompany] = useState(
    JSON.parse(localStorage.getItem("Approved_Company"))?.company
  );
  const [category, setCategory] = useState(
    localStorage.getItem("Category") ?? "All"
  );
  const [paginationData, setPaginationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [editClickID, setEditClickID] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [focusedColumn, setFocusedColumn] = useState(null);
  const [arrayIndex, setArrayIndex] = useState();
  const [batchID, setbatchID] = useState("");
  const [batches, setBatches] = useState([]);
  const [batch, setBatch] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(
    JSON.parse(localStorage.getItem("Approved_Company"))?.selectedBatch || {}
  );
  const [searchText, setSearchText] = useState();
  const [forceUpdate, setForceUpdate] = useState(false); // Dummy state variable for forcing useEffect update
  const [open, setOpen] = useState(false);   // To open search bar

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
    return (page - 1) * paginationData?.rowPerPage + index + 1;
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAnchorE2(null);
  };

  const removeSelectedBatch = () => {
    setSelectedBatch({});
  };

  const handleClear = () => {
    removeSelectedBatch();
    setApproveData([]);
    localStorage.removeItem("Approved_Company");
    localStorage.setItem("Category", "All");
    setCategory("All");
    setBatches([]);
    setCompany(null);
    setPaginationData(null);
    setSearchText("");
  };

  const GetCompaniesName = async () => {
    try {
      setIsLoading(true);
      const res = await Axios.post(API.approve_file_list, {
        // category_flag: category === "Exact Matches"
        // ? "Exact"
        // : category === "Clustered Matches"
        // ? "Clustered"
        // : category,
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
      const res = await Axios.post(API.Approve_BatchesApi, {
        ticker: newCompany,
        categoryFlag:
          category === "Exact Matches"
            ? "Exact"
            : category === "Clustered Matches"
            ? "Clustered"
            : category,
      });
      if (res && res.data) {
        let batchesData = [{ batchId: null, batchName: "All" }];
        const batchesData1 = res.data.map((batch) => ({
          batchId: batch.batchId,
          batchName: batch.batchName,
        }));
        // batchesData = [batchesData, batchesData1].flatMap((element) => element); //both ways possible
        batchesData = [...batchesData, ...batchesData1];
        setBatches(batchesData);
        if (Object.keys(selectedBatch).length <= 0) {
          setSelectedBatch(batchesData[0] || {});
        }
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
      const res = await Axios.post(`${API.approve_file_data}?page=${page}`, {
        ticker: company,
        batchId: selectedBatch?.batchId,
        category_flag:
          category === "Exact Matches"
            ? "Exact"
            : category === "Clustered Matches"
            ? "Clustered"
            : category,
        search_text: searchText,
      });
      if (res?.data) {
        // console.log("data", res.data)
        setApproveData(res?.data?.data);
        setPaginationData(res?.data?.pagination);
        // setPage(res?.data?.pagination?.currentPage);
        setEditClickID(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in fetching Companies approved data", error);
      setApproveData([]);
      setPaginationData(null);
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

  const EditDataChanges = async () => {
    try {
      const dataObject = {};
      columns.slice(0, -1).map((eachCol, ind) => {
        if (ind !== 0 && ind !== 1 && ind !== 2) {
          dataObject[eachCol?.columnKey] =
            approveData[arrayIndex][eachCol?.columnKey];
        }
      });
      // console.log(approveData[arrayIndex]["_id"]);
      // console.log(dataObject);
      setIsLoading(true);
      const res = await Axios.post(`${API.approve_data_edited}`, {
        id: approveData[arrayIndex]["_id"],
        newData: dataObject,
      });
      // console.log(res?.data)
      if (res?.data) {
        setIsLoading(false);
        setSnackbar({
          open: true,
          message: res?.data?.message,
        });
        setEditClickID(null);
        // GetCompanyData();
      }
    } catch (error) {
      console.log("ERROR in saving file", error);
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

  const otherOptions = [];
  const modelOptions = [];

  useEffect(() => {
    if (company && Object.keys(selectedBatch).length > 0) {
      setTimeout(() => {
        GetCompanyData();
      }, 500);
    }
  }, [category, page]);

  useEffect(() => {
    if (company && Object.keys(selectedBatch).length > 0) {
      setTimeout(() => {
        const getlocalStrogageItem = JSON.parse(localStorage.getItem("Approved_Company"))?.selectedBatch;
        if(JSON.stringify(getlocalStrogageItem) !== JSON.stringify(selectedBatch)){
          localStorage.setItem("Approved_Company", JSON.stringify({ selectedBatch, company }));
        }
        GetCompanyData();
      }, 500);
    }
  }, [selectedBatch, forceUpdate]);

  useEffect(() => {
    if (company) {
      setTimeout(() => {
        GetBatchesName(company);
      }, 500);
    }
  }, [company]);

  useEffect(() => {
    dispatch({ type: MENU_OPEN, id: "Approved" });
    GetCompaniesName();
  }, []);

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
        {/* col */}
        <Typography className="approved_filter approved_filter1">
          Company Filter
        </Typography>

        <Autocomplete
        fullWidth
          autoHighlight
          name="company"
          options={options}
          getOptionLabel={(option) => option || ""}
          clearIcon={<></>}
          onChange={(_, newValue) => {
            // console.log(newValue, "hello");
            setApproveData([]);
            setBatches([]);
            setPage(1);
            setSelectedBatch({});
            setCompany(newValue || "");
            setSearchText("");
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
              sx={{ ml: 1 }}
            />
          )}
          key={(option) => option}
          noOptionsText="No Results Found"
        />
        {/* col 2 */}
        <Typography className="approved_filter" sx={{ ml: 2 }}>
          Batches
        </Typography>

        <Autocomplete
          fullWidth
          autoHighlight
          disableClearable
          id="batch-autocomplete"
          options={batches}
          getOptionLabel={(option) => option?.batchName || ""}
          value={selectedBatch}
          onChange={(e, newValue) => {
            setSelectedBatch(newValue);
            setApproveData([]);
            setPage(1);
          }}
          PaperComponent={CustomPaper}
          renderInput={(params) => (
            <TextField
              {...params}
              ///label="Select Batch"
              variant="outlined"
              className="selectbar"
              placeholder="Select batches"
              sx={{ ml: 1 }}
            />
          )}
          key={(option) => option}
          noOptionsText="No Results Found"
        />
        {/* col3 */}
        <Typography className="approved_filter approved_filter2" sx={{ ml: 2 }}>
          Match Type
        </Typography>
        <Autocomplete
        fullWidth
          name="category"
          options={["All", "Clustered Matches", "Exact Matches"]}
          getOptionLabel={(option) => option || ""}
          disableClearable
          onChange={(_, newValue) => {
            localStorage.setItem("Category", newValue);
            setPage(1);
            setCategory(newValue);
          }}
          value={
            ["Clustered Matches", "Exact Matches", "All"].find(
              (item) => item === category
            ) || null
          }
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
              // label="Select company category"
              variant="outlined"
              className="selectbar"
              placeholder="Select company category"
              sx={{ ml: 1 }}
            />
          )}
          key={(option) => option}
          noOptionsText="No Results Found"
        />
        {/* col4 */}
        <Button
          size="large"
          variant="contained"
          color="secondary"
          style={{
            marginLeft: "20px",
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

        <Avatar
                variant="square"
                sx={{
                  minWidth: "60px",
                  height: "51.13px",
                  cursor: "pointer",
                  marginLeft: "10px",
                  borderRadius: "12px",
                  background: "#40434E",
                  "&:active": {
                    background: "#76777c",
                  },
                }}
                onClick={() => {
                  setOpen(true)
                }}
              >
                {open ? <IoMdClose fontSize={22} color="#fff" /> : <BiSearchAlt2 fontSize={20} color={"#fff"} /> }
              </Avatar>

              
      { open && (
          <FormControl fullWidth sx={{ mb: 2 }} className="searchbar_formControl">
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <OutlinedInput
                id="input-search-header"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search for Product Family, Product Category, Item Description and Model Number"
                onBlur={(e) => {
                  // console.log("hiellow", e.target.value)
                  const cleanString = removeSpacesAndNonASCII(e.target.value);
                  setSearchText(cleanString);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    {searchText && (
                      <Avatar
                        sx={{
                          width: "30px",
                          height: "30px",
                          cursor: "pointer",
                          bgcolor: "inherit",
                          ":hover": { background: "#0000000a" },
                        }}
                        onClick={() => {
                          setSearchText("");
                          if (searchText.trim() !== "") {
                            setPage(1); // if already page is 1 then again set its not count as update, so need forceUpdate
                            setForceUpdate(!forceUpdate); // Toggle forceUpdate to force useEffect update
                          }
                        }}
                      >
                        <IoMdClose fontSize={18} color="#0000008a" />
                      </Avatar>
                    )}
                    <Avatar
                      variant="square"
                      sx={{
                        minWidth: "60px",
                        // height: "30px",
                        height: "51.13px",
                        cursor: "pointer",
                        // bgcolor: "inherit",
                        borderTopRightRadius: "12px",
                        borderBottomRightRadius: "12px",
                        background: "#40434E",
                        "&:active": {
                          background: "#76777c",
                        },
                        // ":hover": { background: "#0000000a" },
                      }}
                      onClick={() => {
                        if (company && searchText.trim() !== "") {
                          setPage(1); // if already page is 1 then again set its not count as update, so need forceUpdate
                          setForceUpdate(!forceUpdate); // Toggle forceUpdate to force useEffect update
                        } else {
                          setSearchText("");
                          setSnackbar({
                            open: true,
                            severity: "error",
                            message: !company
                              ? "Please select the company first."
                              : "Please enter a valid input.",
                          });
                        }
                      }}
                    >
                      <BiSearchAlt2 fontSize={18} color="#fff" />
                    </Avatar>
                  </InputAdornment>
                }
                aria-describedby="search-helper-text"
                inputProps={{
                  "aria-label": "weight",
                  // style: { paddingLeft: 0, paddingRight: 0 },
                  style: { paddingRight: 0 },
                }}
                autoComplete="off"
                className="approved_searchbar"
                style={{ marginLeft: "auto", paddingRight: "0px" }}
              />
            </ClickAwayListener>
          </FormControl>
        )
      }

      </FormControl>


      <Paper
        sx={{ width: "100%", overflow: "hidden", mb: "40px", pb: 3 }}
        // className="custom-scrollbar"
        // sx={{ overflowX: "auto" }}
      >
        <TableContainer className="custom-scrollbar" sx={{ overflowX: "auto" }}>
          <Table
            // className="custom-scrollbar"
            stickyHeader
            aria-label="sticky table"
          >
            <TableHead>
              <TableRow className="custom-scrollbar">
                <TableCell
                  className="global_table"
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
                  <TableCell
                    className="global_table"
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
              {approveData && approveData.length > 0 ? (
                approveData
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((rowData, index) => {
                    return (
                      <TableRow className="custom-scrollbar" key={index}>
                        
                        <TableCell className="global_table">
                          {serialNumber(page, index)}
                        </TableCell>

                        {columns &&
                          columns
                            .slice(0, columns.length - 1)
                            .map((column, ind) => (
                              <>
                                {editClickID === rowData?._id &&
                                ind !== 0 &&
                                ind !== 1 &&
                                ind !== 2 ? (
 // ..................Editable Autocomplete for each field........................................
                                  <TableCell
                                    className="global_table"
                                    key={column.id}
                                    align="center"
                                    sx={{ p: 0, position: "relative" }}
                                  >
                                    <Autocomplete
                                      id={`autocomplete-${column.id}`} // Unique ID for each Autocomplete component
                                      className={classes.Autocomplete}
                                      freeSolo
                                      options={
                                        focusedColumn === "model"
                                          ? modelOptions
                                          : otherOptions
                                      }
                                      // OnInputChange of reason is working with value instead of inputValue
                                      value={
                                        focusedColumn === column.id
                                          ? editValue
                                          : rowData[column.columnKey]
                                      }
                                      // inputValue={
                                      //   focusedColumn === column.id
                                      //     ? editValue
                                      //     : rowData[column.columnKey]
                                      // }
                                      onInputChange={(event, newValue, reason) => {
                                        console.log("reason", reason);
                                        console.log("editValue", newValue);
                                        
                                        // Check for reset action means focusing on the field
                                        if (reason === "reset") {
                                          console.log("reset", column.id);
                                          setEditValue(rowData[column.columnKey]);
                                        } else {
                                          // Set new value if not reset
                                          setEditValue(newValue);
                                        }
                                        
                                        // Check for input action means input changing in the field
                                        if (reason === "input") {
                                          if (newValue.length >= 100 && newValue.length <= 150 && focusedColumn) {
                                            setSnackbar({
                                              open: true,
                                              severity: "warning",
                                              message: "You have crossed the limit of 100 characters.",
                                            });
                                          }
                                          if (newValue.length >= 200 && focusedColumn) {
                                            setSnackbar({
                                              open: true,
                                              severity: "error",
                                              message: "You have reached the maximum limit of 200 characters.",
                                            });
                                          }
                                        }
                                      }}  
                                      onKeyDown={(event) => {
                                        if (event.target.value.length >= 200 && focusedColumn) {
                                          setSnackbar({
                                            open: true,
                                            severity: "error",
                                            message:
                                              "You have reached the maximum limit of 200 characters.",
                                          });
                                        }
                                      }}
                                      onFocus={() => {
                                        console.log("focus",column.id)
                                        setFocusedColumn(column.id);
                                        // Reset edit value to the current row data value when the field is focused
                                        // setEditValue(rowData[column.columnKey]);
                                      }}
                                      onBlur={() => {
                                        console.log("blur", editValue);
                                        const cleanString = removeSpacesAndNonASCII(editValue);
                                        rowData[column.columnKey] = cleanString;
                                        approveData[arrayIndex] = rowData;
                                        setApproveData([...approveData]);
                                        setEditValue("");
                                        setFocusedColumn(null);
                                      }}
                                      PaperComponent={CustomPaperEdit}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          variant="outlined"
                                          name={column.label}
                                          type="text"
                                          className={classes.textField}
                                          // autoComplete="off"
                                          inputProps={{
                                            ...params.inputProps,
                                            maxLength: focusedColumn ? 200 : undefined,
                                          }}
                                        />
                                      )}
                                    />

{/* <Autocomplete
  id={`autocomplete-${column.id}`} // Unique ID for each Autocomplete component
  className={classes.Autocomplete}
  freeSolo
  options={focusedColumn === "model" ? modelOptions : otherOptions}
  value={focusedColumn === column.id ? editValue : rowData[column.columnKey]}
  onInputChange={(event, newValue, reason) => {
    console.log("reason", reason);
    console.log("editValue", newValue);
    
    // Check for reset action means focusing on the field
    if (reason === "reset") {
      console.log("reset", column.id);
      setEditValue(rowData[column.columnKey]);
    } else {
      // Set new value if not reset
      setEditValue(newValue);
    }
    
    // Check for input action means input changing in the field
    if (reason === "input") {
      if (newValue.length >= 100 && newValue.length <= 150 && focusedColumn) {
        setSnackbar({
          open: true,
          severity: "warning",
          message: "You have crossed the limit of 100 characters.",
        });
      }
      if (newValue.length >= 200 && focusedColumn) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "You have reached the maximum limit of 200 characters.",
        });
      }
    }
  }}  
  onKeyDown={(event) => {
    if (event.target.value.length >= 200 && focusedColumn) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "You have reached the maximum limit of 200 characters.",
      });
    }
  }}
  onFocus={() => {
    setFocusedColumn(column.id);
    // Reset edit value to the current row data value when the field is focused
    setEditValue(rowData[column.columnKey]);
  }}
  onBlur={() => {
    const cleanString = removeSpacesAndNonASCII(editValue);
    rowData[column.columnKey] = cleanString;
    approveData[arrayIndex] = rowData;
    setApproveData([...approveData]);
    setEditValue("");
    setFocusedColumn(null);
  }}
  PaperComponent={CustomPaperEdit}
  renderInput={(params) => (
    <TextField
      {...params}
      variant="outlined"
      name={column.label}
      type="text"
      className={classes.textField}
      inputProps={{
        ...params.inputProps,
        maxLength: focusedColumn ? 200 : undefined,
      }}
    />
  )}
/> */}


                                  </TableCell>
                                ) : (
                                  <TableCell
                                    className="global_table"
                                    key={column.id}
                                    align="center"
                                    style={{
                                      whiteSpace: "normal",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    {rowData[column.columnKey]}
                                  </TableCell>
                                )}
                              </>
                            ))}

                        <TableCell className="global_table">
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <BiSolidEdit
                              style={{
                                cursor: "pointer",
                                fontSize: "20px",
                              }}
                              title={
                                editClickID !== rowData?._id
                                  ? undefined
                                  : "Already editing the row."
                              }
                              onClick={async () => {
                                if (!editClickID) {
                                  setArrayIndex(index);
                                  setEditClickID(rowData?._id);
                                  // setbatchID(rowData?.batchID)

                                  // set// uniqueId set
                                  // setDisableColon(true);
                                  // setArrayIndex(ind); // array index set
                                } else {
                                  setSnackbar({
                                    open: true,
                                    severity: "error",
                                    message: "Already editing the row.",
                                  });
                                }
                                await EventsAPIs(
                                  rowData?.batchId,
                                  EDIT_ROW_APPROVED
                                );
                              }}
                            />

                            <IconButton
                              disabled={
                                editClickID === rowData?._id ? false : true
                              }
                              onClick={(event) => {
                                // setArrayIndex(ind); // array index set
                                // setUniqueId(rowData?._id); // uniqueId set
                                if (!editClickID) {
                                  setAnchorEl(event.currentTarget);
                                } else {
                                  setAnchorE2(event.currentTarget);
                                  setbatchID(rowData?.batchId);
                                }
                              }}
                            >
                              <IoEllipsisVerticalSharp
                                style={{
                                  cursor: "pointer",
                                  fontSize: "17px",
                                }}
                              />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell
                    // className="global_table"
                    sx={{ textAlign: "center", borderRight: "none !important" }}
                    colSpan={12}
                  >
                    {company
                      ? "No Record Found"
                      : "Please select a company first."}
                  </TableCell>
                  <TableCell
                    className="global_table"
                    sx={{ textAlign: "center", borderLeft: "none !important" }}
                    colSpan={6}
                  ></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[50, 100]}
          component="div"
          count={approveData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
        {approveData.length > 0 && paginationData?.totalPages > 1 && (
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
      {/* Menu Items of IconButton for anchorEl and anchorE2 respectively  */}
      {anchorE2 && (
        <LongMenu
          anchorEl={anchorE2}
          handleClose={handleMenuClose}
          Items={[
            {
              text: (
                <>
                  <FiSave fontSize={18} color="#40434E" />
                  &nbsp; Save
                </>
              ),
              onClick: async () => {
                EditDataChanges();
                handleMenuClose();
                await EventsAPIs(batchID, SAVE_ROW_APPROVED);
              },
            },
            {
              text: (
                <>
                  <MdCancel fontSize={19} color="#E11927" />
                  &nbsp; Discard Changes
                </>
              ),
              onClick: async () => {
                setEditClickID(null);
                handleMenuClose();
                GetCompanyData();
                // console.log(batchID, "hello batch id");
                await EventsAPIs(batchID, DISCARD_CHANGES_APPROVED);
              },
            },
          ]}
        />
      )}
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
      {/* </MainCard> */}
    </>
  );
};

export default ApprovedMatches;
