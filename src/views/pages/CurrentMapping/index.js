import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { MENU_OPEN } from "store/actions";
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
  Avatar,
  Box,
  Button,
  ButtonBase,
  FormControl,
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
import { padding, styled } from "@mui/system";
import { IoMdClose } from "react-icons/io";
import { removeSpacesAndNonASCII } from "utils/global_functions";

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
  { id: "company", columnKey: "Company", label: "Company" },
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
  { id: "material", columnKey: "Material", label: "Material" },
  { id: "size", columnKey: "Size", label: "Size" },
  // { id: "comment", columnKey: "comment", label: "Notes" },
  // { id: "action", columnKey: "action", label: "Actions" },
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

const CustomPaper = (props) => (
  <Paper
    {...props}
    style={{
      boxShadow:
        "0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)",
    }}
  />
);

const CustomPaperEdit = (props) => (
  <Paper {...props} style={{ backgroundColor: "#DFDFDF" }} />
);

const CurrentMapping = () => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [approveData, setApproveData] = useState([]);
  const [options, setOptions] = useState([]);
  const [company, setCompany] = useState(
    localStorage.getItem("C_Mapping_Company")
  );
  // const [category, setCategory] = useState(
  //   localStorage.getItem("Category") ?? "Clustered Matches"
  // );
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
  const [searchText, setSearchText] = useState();
  const [forceUpdate, setForceUpdate] = useState(false); // Dummy state variable for forcing useEffect update

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
    setAnchorEl(null);
    setAnchorE2(null);
  };

  const GetCompaniesName = async () => {
    try {
      setIsLoading(true);
      const res = await Axios.get(API.Current_Mapping_Companies);
      if (res) {
        // console.log("profile", res.data)
        setOptions(res?.data?.tickerNames);
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
      const res = await Axios.post(`${API.Current_Mapping_Data}`, {
        ticker: company,
        search_content: searchText,
        page,
      });
      if (res?.data) {
        // console.log("data", res.data)
        setApproveData(res?.data?.data);
        setPaginationData(res?.data?.pagination);
        // setPage(res?.data?.pagination?.currentPage);
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
        if (ind !== 0 && ind !== 1 && ind !== 2 && ind !== 3) {
          dataObject[eachCol?.columnKey] =
            approveData[arrayIndex][eachCol?.columnKey];
        }
      });
      console.log(approveData[arrayIndex]["_id"]);
      console.log(dataObject);
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
    if (company) {
      setTimeout(() => {
        GetCompanyData();
      }, 500);
    }
  }, [company, page, forceUpdate]);

  useEffect(() => {
    dispatch({ type: MENU_OPEN, id: "CurrentMapping" });
    GetCompaniesName();
  }, []);

  const calculateRemainingCharacters = (text, maxLength) => {
    console.log(text, "iamtext");
    if (!text) {
      text = "";
    }
    return maxLength - text.length;
  };

  return (
    <>
      {/* <MainCard title="Approved Matches"> */}

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
          clearIcon={<></>}
          onChange={(_, newValue) => {
            // console.log(newValue, "hello");
            setSearchText("")
            setApproveData([]);
            setCompany(newValue || "");
            if (newValue) {
              localStorage.setItem("C_Mapping_Company", newValue);
              setPage(1);
              // GetCompanyData(newValue, page);
            }
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

        {/* <Typography className="company_filter" sx={{ ml: 2 }}>
          Match Type
        </Typography>
        <Autocomplete
          name="category"
          options={["Clustered Matches", "Exact Matches", "All"]}
          getOptionLabel={(option) => option || ""}
          clearIcon={<></>}
          onChange={(_, newValue) => {
            // console.log(newValue, "hello");
            if (newValue) {
              // if(company){
              //   GetCompanyData(company, page)
              // }
              // localStorage.removeItem("C_Mapping_Company")
              localStorage.setItem("Category", newValue);
            }
            // setApproveData([]);
            // setCompany(null);
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
              sx={{ width: "300px", ml: 3 }}
            />
          )}
          key={(option) => option}
          noOptionsText="No Results Found"
        /> */}

        <Button
          size="large"
          variant="contained"
          color="secondary"
          style={{
            marginLeft: "15px",
            background: "#40434E",
            padding: "12px 20px",
            borderRadius: "15px",
            color: "white",
          }}
          onClick={() => {
            setApproveData([]);
            localStorage.removeItem("C_Mapping_Company");
            setCompany(null);
            setPaginationData(null);
            setSearchText("");
          }}
        >
          CLEAR
        </Button>

        {/* <Autocomplete
          name="category"
          // open={false}
          // getOptionDisabled={true}
          // disableListWrap
          options={[]}
          getOptionLabel={(option) => option || ""}
          onChange={(_, newValue) => {
            // console.log(newValue, "hello");
            if (newValue) {
              // if(company){
              //   GetCompanyData(company, page)
              // }
              // localStorage.removeItem("C_Mapping_Company")
              localStorage.setItem("Category", newValue);
            }
            // setApproveData([]);
            // setCompany(null);
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
              sx={{ width: "300px" }}
            />
          )}
          key={(option) => option}
          style={{marginLeft: "auto"}}
          noOptionsText="No Results Found"
        />  */}

        {/* <TextField
          label="Search"
          variant="outlined"
          // value={searchText}
          // onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BiSearchAlt2 fontSize={18} color="#8492c4" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IoMdClose fontSize={18} color="#0000008a" />
              </InputAdornment>
            ),
          }}
          style={{ marginLeft: "auto" }}
        /> */}
        
        <OutlinedInput
          id="input-search-header"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search"
          onBlur={(e) => {
            // console.log("hiellow", e.target.value)
            const cleanString = removeSpacesAndNonASCII(e.target.value)
            setSearchText(cleanString)
          }}
          // startAdornment={
          //   <InputAdornment position="start">
          //     <BiSearchAlt2 fontSize={18} color="#8492c4" />
          //   </InputAdornment>
          // }
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
                  // width: "30px",
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
                {/* <BiSearchAlt2 fontSize={18} color="#8492c4" /> */}
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
          style={{ marginLeft: "auto", width: "260px", paddingRight: "0px" }}
        />

        {/* <Button
          size="large"
          variant="contained"
          color="secondary"
          style={{
            marginLeft: "15px",
            background: "#40434E",
            padding: "12px 20px",
            borderRadius: "15px",
            color: "white",
          }}
          onClick={() => {
            setApproveData([]);
            localStorage.removeItem("C_Mapping_Company");
            localStorage.setItem("Category", "Clustered Matches");
            setCompany(null);
            setPaginationData(null);
            setCategory("Clustered Matches");
          }}
        >
          Search
        </Button> */}
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
              {approveData && approveData.length > 0 ? (
                approveData
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((rowData, index) => {
                    return (
                      <TableRow className="custom-scrollbar" key={index}>
                        <TableCell className="global_table">{serialNumber(page, index)}</TableCell>

                        {/* {columns &&
                          columns.slice(0, columns.length - 1).map((column) => (
                            <TableCell className="global_table" key={column.id} align="center">
                              {rowData[column.columnKey]}
                            </TableCell>
                          ))} */}

                        {columns &&
                          columns
                            // .slice(0, columns.length - 1)
                            .map((column, ind) => (
                              <>
                                {editClickID === rowData?._id &&
                                ind !== 0 &&
                                ind !== 1 &&
                                ind !== 2 &&
                                ind !== 3 ? (
                                  <TableCell className="global_table"
                                    key={column.id}
                                    align="center"
                                    sx={{ p: 0, position: "relative" }}
                                  >
                                    <Autocomplete
                                      id="free-solo-demo"
                                      name={column.label}
                                      className={classes.Autocomplete}
                                      freeSolo
                                      clearIcon={<></>}
                                      options={
                                        focusedColumn === "model"
                                          ? modelOptions
                                          : otherOptions
                                      }
                                      // Below onChange is run, after pressing enter or select option
                                      // onChange={(e, new_Value) => {
                                      //   console.log(e.target.value, "hello New Values on enter/select");
                                      //   setEditValue(new_Value);
                                      // }}
                                      // value={
                                      //   focusedColumn === column.id
                                      //     ? editValue
                                      //     : rowData[column.columnKey]
                                      // }
                                      onFocus={() => {
                                        setFocusedColumn(column.id);
                                        setEditValue(rowData[column.columnKey]);
                                      }}
                                      // Inside onBlur function
                                      onBlur={() => {
                                        // console.log("editValue", editValue);
                                        rowData[column.columnKey] = editValue;
                                        approveData[arrayIndex] = rowData;
                                        setApproveData(approveData);
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
                                          onChange={(event) => {
                                            // console.log(
                                            //   event.target.value,
                                            //   "hello New Values "
                                            // );
                                            if (
                                              event.target.value?.length >=
                                                200 &&
                                              focusedColumn === "comment"
                                            ) {
                                              setSnackbar({
                                                open: true,
                                                severity: "error",
                                                message:
                                                  "More than 200 characters are not allowed",
                                              });
                                            }
                                            setEditValue(event.target.value);
                                          }}
                                          value={
                                            focusedColumn === column.id
                                              ? editValue
                                              : rowData[column.columnKey]
                                          }
                                          inputProps={
                                            focusedColumn === "comment"
                                              ? { maxLength: 200 }
                                              : {}
                                          }
                                          autoComplete="off"
                                        />
                                      )}
                                    />
                                  </TableCell>
                                ) : (
                                  <TableCell className="global_table textWraping" key={column.id} align="center">
                                    {rowData[column.columnKey]}
                                  </TableCell>
                                )}
                              </>
                            ))}

                        {/* Actions */}
                        {/* <TableCell className="global_table">
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
                              onClick={() => {
                                if (!editClickID) {
                                  setArrayIndex(index);
                                  setEditClickID(rowData?._id); // uniqueId set
                                  // setDisableColon(true);
                                  // setArrayIndex(ind); // array index set
                                } else {
                                  setSnackbar({
                                    open: true,
                                    severity: "error",
                                    message:
                                      "Already editing the row.",
                                  });
                                }
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
                        </TableCell> */}
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell 
                  // className="global_table"
                    sx={{ textAlign: "center", borderRight: "none !important" }}
                    colSpan={10}
                  >
                    {company
                      ? "No Record Found"
                      : "Please select a company first."}
                  </TableCell>
                  <TableCell className="global_table"
                    sx={{ textAlign: "center", borderLeft: "none !important" }}
                    colSpan={9}
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
              onClick: () => {
                EditDataChanges();
                handleMenuClose();
              },
            },
            {
              text: (
                <>
                  <MdCancel fontSize={19} color="#E11927" />
                  &nbsp; Discard Changes
                </>
              ),
              onClick: () => {
                setEditClickID(null);
                handleMenuClose();
                GetCompanyData();
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

export default CurrentMapping;
