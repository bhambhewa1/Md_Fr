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
  Button,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import Loading from "ui-component/components/Loading";
import Message from "ui-component/components/Snackbar/Snackbar";
import Axios from "api/Axios";
import { API } from "api/API";

const columns = [
  { id: "mf_id", columnKey: "ManufacturerId", label: "ManufacturerId" },
  {
    id: "mf_catlog",
    columnKey: "ManufacturerCatalogNumber",
    label: "ManufacturerCatalogNumber",
  },
  {
    id: "item_desc",
    columnKey: "ItemDescription",
    label: "ItemDescription",
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
];

const ApprovedMatches = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [approveData, setApproveData] = useState([]);
  const [options, setOptions] = useState([]);
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

  const GetCompainesName = async () => {
    try {
      setIsLoading(true);
      const res = await Axios.get(API.approve_file_list);
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
      const res = await Axios.post(API.approve_file_data, { filename: data });
      if (res) {
        // console.log("data", res.data)
        setApproveData(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in fetching Companies approved data", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.message,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch({ type: MENU_OPEN, id: "Approved" });
    GetCompainesName();
  }, []);

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
            setApproveData([]);
            setCompany(newValue || "");
            if (newValue) {
              GetCompanyData(newValue);
            }
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
            setApproveData([]);
            setCompany(null);
          }}
        >
          CLEAR
        </Button>
      </FormControl>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer className="custom-scrollbar">
          <Table
            className="custom-scrollbar"
            stickyHeader
            aria-label="sticky table"
          >
            <TableHead>
              <TableRow className="custom-scrollbar">
                <TableCell
                  align="right"
                  style={{ backgroundColor: "#40434E", color: "#fff" }}
                >
                  #
                </TableCell>

                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="right"
                    style={{ backgroundColor: "#40434E", color: "#fff" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {approveData && approveData.length > 0 ? (
                approveData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((rowData, index) => {

                    return (
                      <TableRow className="custom-scrollbar" key={index}>
                        <TableCell>{serialNumber(page, index)}</TableCell>

                        {columns &&
                          columns.map((column) => (
                            <TableCell key={column.id} align="right">
                              {rowData[column.columnKey]}
                            </TableCell>
                          ))}
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell style={{ textAlign: "center" }} colSpan={8}>
                    Please select a company first.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[50, 100]}
          component="div"
          count={approveData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
      {/* </MainCard> */}
    </>
  );
};

export default ApprovedMatches;
