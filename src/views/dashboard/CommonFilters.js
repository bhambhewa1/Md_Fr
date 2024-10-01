import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  Pagination,
  TextField,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import CustomPaper from "ui-component/components/CustomPaper";
import CommonTable from "ui-component/components/CommonTable";
import {
  columns,
  FillAll_Inner_Columns,
  FillAll_TotalR_Columns,
  User_Analytics_columns,
  User_Analytics_Inner_Columns,
} from "./DashboardTablesConst";
import FillAllTable from "./FillAllTable";
import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "ui-component/components/Loading";
import Message from "ui-component/components/Snackbar/Snackbar";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import UserAnalyticsTable from "./UserAnalyticsTable";

const CommonFilters = ({ Heading }) => {
  const dateRanges = useSelector((state) => state.DashboardPersist.dateRanges);
  const today = new Date().toISOString().split("T")[0];
  const initialValues = {
    from: dateRanges?.startOfWeek,
    to: dateRanges?.endOfWeek,
    status: "All",
    user: { userId: "all", userName: "All" },
    batch: "All",
    company: "All",
    // submit: null,
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [users, setUsers] = useState([{ userId: "all", userName: "All" }]);
  const [batches, setBatches] = useState(["All"]);
  const [companies, setCompanies] = useState(["All"]);
  const [mainData, setMainData] = useState({});
  const [page, setPage] = useState(1);
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

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
  };

  const getFilteredColumns = () => {
    let filteredColumns = columns.filter((column) => {
      if (Heading === "All Companies") {
        return (
          column.id !== "batch_name" &&
          column.id !== "approved_records" &&
          column.id !== "published_records" &&
          column.id !== "total_pending"
        );
      }
      if (Heading === "Published Records") {
        return (
          column.id !== "clustered_matches" && column.id !== "exact_matches"
        );
      }
      if (
        Heading === "Approved Matches" ||
        Heading === "Clustered Matches" ||
        Heading === "Exact Matches" ||
        Heading === "Active Batches"
      ) {
        return (
          column.id === "company" ||
          column.id === "batch_name" ||
          column.id === "total_records"
        );
      }
    });
    return filteredColumns;
  };

  const CollapseCardfilteredColumn = (type) => {
    const filterCol =
      type === "inner" ? FillAll_Inner_Columns : FillAll_TotalR_Columns;
    let filteredColumns = filterCol.filter((column) => {
      if (Heading === "Fill All Percentage") {
        return (
          column.id !== "exact_matches" && column.id !== "clustered_matches"
        );
      }
      if (Heading === "Total Records") {
        return column.id !== "fill_all";
      }
    });
    return filteredColumns;
  };

  const GetUsersList = async (fromDate, toDate) => {
    try {
      setIsLoading(true);
      const res = await Axios.get(API.Dashboard_User_List);
      if (res?.data) {
        // console.log("profile", res.data)
        let usersData = [{ userId: "all", userName: "All" }];
        const usersData1 = res?.data.map((user) => ({
          userId: user._id,
          userName: user.name,
        }));
        usersData = [...usersData, ...usersData1];
        setUsers(usersData);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in fetching users list", error);
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

  const GetCompaniesName = async (fromDate, toDate) => {
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Dashboard_companies, {
        fromDate,
        toDate,
      });
      if (res?.data) {
        // console.log("profile", res.data)
        // let fixArray = [...companies, ...res?.data?.response]
        let fixArray = ["All"];
        fixArray = [...fixArray, ...res?.data?.response];
        setCompanies(fixArray);
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

  const GetBatchesName = async (fromDate, toDate, newCompany) => {
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Dashboard_batches, {
        fromDate,
        toDate,
        ticker: newCompany,
      });
      if (res && res?.data) {
        console.log(res?.data);
        let fixArray = ["All"];
        fixArray = [...fixArray, ...res?.data?.response];
        setBatches(fixArray);
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

  const GetData = async (URL, Payload) => {
    try {
      setIsLoading(true);
      const res = await Axios.post(URL, Payload);
      if (res && res?.data) {
        // console.log(res?.data);
        setMainData(res?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(`ERROR in fetching ${URL}`, error);
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

  const createAPIsPayload = async (values) => {
    let {from: fromDate,to: toDate,company: ticker,batch: batchName,user,status} = values;
    let URL,Payload,userId = user?.userId;
    status = status === "All" ? undefined : status === "Todo" ? "todo" : status === "In Progress" ? "pending" : "completed";
    if (ticker === "All") {
      ticker = undefined;
    }
    if (batchName === "All") {
      batchName = undefined;
    }
    if (userId === "all" || user?.userName === "All") {
      userId = undefined;
    }

    switch (Heading) {
      case "All Companies":
        URL = API.All_Companies_GridData;
        Payload = { fromDate, toDate, status, ticker, page };
        break;
      case "Total Records":
        URL = API.Total_Records_GridData;
        Payload = { fromDate, toDate, ticker, page };
        break;
      case "Approved Matches":
        URL = API.Approved_Matches_GridData;
        Payload = {
          fromDate,
          toDate,
          datatype: "approved",
          ticker,
          batchName,
          page,
        };
        break;
      case "Clustered Matches":
        URL = API.Approved_Matches_GridData;
        Payload = {
          fromDate,
          toDate,
          datatype: "clustered",
          ticker,
          batchName,
          page,
        };
        break;
      case "Exact Matches":
        URL = API.Approved_Matches_GridData;
        Payload = {
          fromDate,
          toDate,
          datatype: "exact",
          ticker,
          batchName,
          page,
        };
        break;
      case "Fill All Percentage":
        URL = API.Fill_All_Perc_GridData;
        Payload = { fromDate, toDate, ticker, batchName, page };
        break;
      case "Active Batches":
        URL = API.Active_Batches_GridData;
        Payload = { fromDate, toDate, ticker, batchName, page };
        break;
      case "Published Records":
        URL = API.Published_Records_GridData;
        Payload = { fromDate, toDate, ticker, batchName, page };
        break;
      case "User Analytics":
        URL = API.User_Analytics_GridData;
        Payload = { fromDate, toDate, ticker, userId, page };
        break;
    }

    await GetData(URL, Payload);
  };

  const onhandleSubmitForm = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    // console.log("submit", values);
    // setSubmitting(true);
    setPage(1);
    setFormValues(values);
    // await createAPIsPayload(values);
    // setSubmitting(false);
  };

  useEffect(() => {
    setMainData({});
    createAPIsPayload(formValues);
  }, [page, formValues]);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Formik
        initialValues={initialValues}
        // validationSchema={Yup.object().shape({
        //   from: Yup.string()
        //     .email("Must be a valid email")
        //     .max(255)
        //     .required("Email is required"),
        //   // password: Yup.string().max(255).required("Password is required"),
        // })}
        onSubmit={onhandleSubmitForm}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          resetForm,
          values,
          setFieldValue,
        }) => (
          <form
            noValidate
            onSubmit={handleSubmit}
            style={{ width: "100%", marginBottom: "20px", marginTop:"10px", border: "none" }}
          >
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              // sx={{ alignItems: "center", marginBottom: 5 }}
              // sx={{bgcolor:"red"}}
            >
              <Grid item xs={3}>
                <FormControl
                  fullWidth
                  // error={Boolean(touched.email && errors.email)}
                  // sx={{ ...theme.typography.customInput }}
                >
                  <TextField
                    name="from"
                    label="From Date"
                    type="date"
                    value={values.from}
                    // onChange={(e) => onFromDateChange(setFieldValue, values, e)}
                    onChange={(e) => {
                      // console.log("hi",e.target.value);
                      setFieldValue("from", e.target.value);
                      setFieldValue("company", initialValues?.company);
                      setFieldValue("batch", initialValues?.batch);
                    }}
                    // error={errors.from}
                    // helperText={
                    //   errors.from && "Please enter the starting date"
                    // }
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ max: today }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={3}>
                <FormControl
                  fullWidth
                  // error={Boolean(touched.email && errors.email)}
                  // sx={{ ...theme.typography.customInput }}
                >
                  <TextField
                    name="to"
                    label="To Date"
                    type="date"
                    value={values.to}
                    onChange={(e) => {
                      setFieldValue("to", e.target.value);
                      setFieldValue("company", initialValues?.company);
                      setFieldValue("batch", initialValues?.batch);
                    }}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ max: today }}
                  />
                </FormControl>
              </Grid>

              {Heading === "User Analytics" && (
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      name="user"
                      options={users}
                      getOptionLabel={(option) => option.userName || ""}
                      disableClearable
                      onChange={(_, newValue) => {
                        setFieldValue("user", newValue);
                        setFieldValue("company", initialValues?.company);
                      }}
                      // find() returns the value of the first element in an array (here item return) that passes a test
                      value={
                        users.find(
                          (item) => item.userId === values.user.userId
                        )
                      }
                      onFocus={async () => {
                        if (!isSubmitting) {
                          await GetUsersList(values?.from, values?.to);
                        }
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.userId === value.userId
                      }
                      PaperComponent={CustomPaper}
                      renderOption={(props, option) => (
                        <li {...props}>{option.userName}</li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="User"
                          variant="outlined"
                          placeholder="Select user"
                        />
                      )}
                      noOptionsText="No Results Found"
                    />
                  </FormControl>
                </Grid>
              )}

              {Heading === "All Companies" && (
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <Autocomplete
                      name="status"
                      options={["All", "Todo", "In Progress", "Completed"]}
                      getOptionLabel={(option) => option || ""}
                      disableClearable
                      onChange={(_, newValue) => {
                        setFieldValue("status", newValue);
                        // setFieldValue("company", initialValues?.company);
                      }}
                      // find() returns the value of the first element in an array (here item return) that passes a test
                      value={values?.status}
                      // onFocus={async () => {
                      //   if (!isSubmitting) {
                      //     await GetUsersList(values?.from, values?.to);
                      //   }
                      // }}
                      isOptionEqualToValue={(option, value) => option === value}
                      PaperComponent={CustomPaper}
                      renderOption={(props, option) => (<li {...props}>{option}</li>)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Status"
                          variant="outlined"
                          placeholder="Select status"
                        />
                      )}
                      noOptionsText="No Results Found"
                    />
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={3}>
                <FormControl fullWidth>
                  <Autocomplete
                    name="companies"
                    options={companies}
                    getOptionLabel={(option) => option || ""}
                    disableClearable
                    onChange={(_, newValue) => {
                      setFieldValue("company", newValue);
                      setFieldValue("batch", initialValues?.batch);
                    }}
                    value={
                      companies.find((item) => item === values.company) || null
                    }
                    onFocus={async () => {
                      if (!isSubmitting) {
                        await GetCompaniesName(values?.from, values?.to);
                      }
                    }}
                    isOptionEqualToValue={(option, value) => option === value}
                    PaperComponent={CustomPaper}
                    renderOption={(prop, option) => <li {...prop}>{option}</li>}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Company"
                        variant="outlined"
                        placeholder="Select company"
                      />
                    )}
                    noOptionsText="No Results Found"
                  />
                </FormControl>
              </Grid>

              {Heading !== "All Companies" &&
                Heading !== "Total Records" &&
                Heading !== "User Analytics" && (
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <Autocomplete
                        name="batch"
                        options={batches}
                        getOptionLabel={(option) => option || ""}
                        disableClearable
                        onChange={(_, newValue) =>
                          setFieldValue("batch", newValue)
                        }
                        value={
                          batches.find((item) => item === values.batch) || null
                        }
                        onFocus={async () => {
                          if (!isSubmitting) {
                            await GetBatchesName(
                              values.from,
                              values.to,
                              values.company
                            );
                          }
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option === value
                        }
                        PaperComponent={CustomPaper}
                        renderOption={(prop, option) => (
                          <li {...prop}>{option}</li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Batch"
                            variant="outlined"
                            placeholder="Select batch"
                          />
                        )}
                        noOptionsText="No Results Found"
                      />
                    </FormControl>
                  </Grid>
                )}

              <Grid item xs={3} sx={{ display: "flex", gap: 3 }}>
                <Button
                  size="large"
                  variant="contained"
                  style={{
                    border: "1px solid rgb(181 8 20)",
                    background: "rgb(225 25 39)",
                    padding: "12px 20px",
                    borderRadius: "15px",
                    color: "rgb(255 255 255)",
                  }}
                  type="submit"
                >
                  SUBMIT
                </Button>

                <Button
                  size="large"
                  variant="contained"
                  color="secondary"
                  style={{
                    // marginLeft: "10px",
                    background: "#40434E",
                    padding: "12px 20px",
                    borderRadius: "15px",
                    color: "white",
                  }}
                  onClick={() => {
                    const isDifferent = JSON.stringify(formValues) !== JSON.stringify(initialValues);
                    if (isDifferent) {
                      setFormValues(initialValues);
                    }
                    setPage(1);
                    resetForm();
                  }}
                >
                  CLEAR
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      {Heading === "User Analytics" ? (
        <UserAnalyticsTable
          columns={User_Analytics_columns}
          InnerColumns={User_Analytics_Inner_Columns}
          MainDataArray={mainData?.aggregatedData || []}
          serial={(page - 1) * mainData?.rowsPerPage}
        />
      ) : Heading === "Fill All Percentage" || Heading === "Total Records" ? (
        <FillAllTable
          columns={CollapseCardfilteredColumn()}
          InnerColumns={CollapseCardfilteredColumn("inner")}
          MainDataArray={mainData?.aggregatedData || []}
          serial={(page - 1) * mainData?.rowsPerPage}
        />
      ) : (
        <CommonTable
          columns={getFilteredColumns()}
          MainDataArray={mainData?.aggregatedData || []}
          serial={(page - 1) * mainData?.rowsPerPage}
        />
      )}

      {mainData &&
        mainData?.aggregatedData?.length > 0 &&
        mainData?.totalPages > 1 && (
          <Pagination
            count={mainData?.totalPages}
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

      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </div>
  );
};

export default CommonFilters;
