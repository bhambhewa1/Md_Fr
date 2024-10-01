import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Button,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableSortLabel,
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

// Icons
import {
  BiSolidRightArrow,
  BiSolidDownArrow,
  BiSolidEdit,
} from "react-icons/bi";
import { MdCancel } from "react-icons/md";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import { FcApproval } from "react-icons/fc";

// Components
import Popup from "ui-component/components/Popup";
import "../ClusteredMatches/style.css";
import LongMenu from "ui-component/menu-cluster/ClusterMenu";
import Loading from "ui-component/components/Loading";
import Message from "ui-component/components/Snackbar/Snackbar";
import Axios from "api/Axios";
import { API } from "api/API";
import { columns, requiredKeys } from "./ExactMatchesColumns";
import { EventsAPIs, removeSpacesAndNonASCII } from "utils/global_functions";
import { APPROVE_ROW_EXACT, DISCARD_CHANGES_EXACT, EDIT_ROW_EXACT, SAVE_APPROVE_ROW_EXACT, SAVE_ROW_EXACT } from "store/actions";

const useStyles = makeStyles((theme) => ({
  textField: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "transparent", // Remove outer border
        padding: "0px",
        width: "100%",
        margin: "0px",
        borderRadius: "0px",
        color: "#333",
        // backgroundColor: '#DFDFDF', // Remove background color
        // backgroundColor: "transparent",
        // backgroundColor: "gray"
      },
      "&:hover fieldset": {
        borderColor: "transparent", // Remove border on hover
        borderRadius: "0px",
      },
      "&.Mui-focused": {
        border: "1px solid #1a73e8",
        borderRadius: 0,
        textAlign: "center",
        // background: "#f8fafc",
      },
      "&.Mui-focused fieldset": {
        borderColor: "transparent", // Remove border when focused
        borderRadius: "0px",
        // border: "none",
      },
      "&.Mui-focused .inputPropsInner": {
        // background: "#eaebed",
        borderRadius: 0,
        color: "#333",
      },
    },
  },
}));

const AlwaysNotEditableFields = ({ innerRow }) =>
  columns
    .slice(0, 4)
    .map((column,index) => (
      <TableCell className="global_table" align="center" key={column.id}>
        {index !== 2 && innerRow[column?.columnKey] ? innerRow[column?.columnKey] : ""}
        {index === 2 &&  <Tooltip
            componentsProps={{
              tooltip: {
                sx: {
                  border: "0.5px solid #333",
                  bgcolor: "#fff",
                  borderRadius: "10px",
                  fontSize: "12px",
                  p: 1,
                  color: "#333",
                },
              },
            }}
            title={
              innerRow?.ItemDescription
                ? innerRow?.ItemDescription
                : ""
            }
          >
            <Typography className="item_description">
              {innerRow?.ItemDescription
                ? innerRow?.ItemDescription
                : ""}
            </Typography>
          </Tooltip>}
      </TableCell>
    ));

const NotEditableFieldsComponent = ({ innerRow }) =>
  columns
    .slice(4, columns.length - 2)
    .map((column) => (
      <TableCell className="global_table" align="center" key={column.id}>
        {innerRow[column?.columnKey] ? innerRow[column?.columnKey] : ""}
      </TableCell>
    ));

const CustomPaper = (props) => (
  <Paper {...props} style={{ backgroundColor: "#DFDFDF" }} />
);

const Row = ({
  parent_id,
  batchId,
  defaultArray,
  outerObject,
  index,
  page,
  setPage,
  GetCompanyData,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [innerArray, setInnerArray] = useState(defaultArray);
  const [arrayIndex, setArrayIndex] = useState();
  const [popupOpen, setPopupOpen] = useState({
    open: false,
    type: "save&approve/cancel",
  });
  const [editClickID, setEditClickID] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [focusedColumn, setFocusedColumn] = useState(null);
  const [disableColon, setDisableColon] = useState(false);
  const [disableRowOption, setDisableRowOption] = useState(false);
  const [UniqueId, setUniqueId] = useState("");
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

  const handleMenuClose = () => {
    setAnchorEl(null);
    setAnchorE2(null);
  };

  const EditData = async (flag) => {
    // GET LAST ROW FROM ARRAY AND SAVE THAT
    let AllfieldsMandatory = "";
    const data = {
      obj_id: parent_id,
      uniqueId: editClickID,
      action: "edit",
      details: innerArray[0],
    };
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Exact_Edit_Data, data);
      if (res?.data) {
        setSnackbar({
          open: true,
          message: res.data.message,
        });
        const dataPath = res?.data?.data?.data;
        if(dataPath && dataPath.Exact_point) {
          const exactPoint = dataPath.Exact_point;
          if (Array.isArray(exactPoint)) {
            setInnerArray([...exactPoint]);
          } else {
            // console.error("Exact_point is not an array:", exactPoint);
            setInnerArray([exactPoint]);
          }
        }

        if (flag === "save&Approve") {
          approveData();
        } else {
          setIsLoading(false);
        }
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

  const approveData = async () => {
    let AllfieldsMandatory = "";
    let data = {
      obj_id: parent_id,
      uniqueId: innerArray[0]?.uniqueId,
      action: "approve",
      created_date: outerObject?.created_date,
      batchId,
      email: JSON.parse(localStorage.getItem("Profile_Details"))?.email,
    };
    let obj = innerArray[0];
    for (let field of requiredKeys) {
      if (!obj[field]) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Please fill out all the fields before approving",
        });
        AllfieldsMandatory = "true";
      }
    }
    if (AllfieldsMandatory === "true") {
      console.log(obj);
      setIsLoading(false);
    } else {
      try {
        setIsLoading(true);
        const res = await Axios.post(API.Exact_Approve_Data, data);
        if (res) {
          setSnackbar({
            open: true,
            message: res.data.message,
          });
          setTimeout(() => {
            if (setPage !== "samePage") {
              setPage(page - 1);
            } else {
              GetCompanyData();
            }
          }, 1000);
          // setIsLoading(false);
        }
      } catch (error) {
        console.log("ERROR in approve or save&approve file", error);
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
    }
  };

  const ResetEditedRow = async (index) => {
    const data = {
      obj_id: parent_id,
      uniqueId: editClickID,
    };
    try {
      setIsLoading(true);
      const res = await Axios.post(API.ResetRow_Cancel_Exact, data);
      if (res) {
        setSnackbar({
          open: true,
          message: res.data.message,
        });
        setInnerArray([res?.data?.data]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in approve or save&approve file", error);
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

  const handleApprove = () => {
    setPopupOpen({
      open: true,
      type: "Approve",
    });
  };

  const initializeRow = (isCopy) => {
    let newRow = {};
    columns.slice(0, columns.length - 1).map((item) => {
      const rowKey = item.columnKey;
      switch (rowKey) {
        case "ManufacturerId":
          newRow[rowKey] = `${outerObject.ManufacturerId}`;
          break;
        case "ManufacturerCatalogNumber":
          newRow[rowKey] = outerObject.ManufacturerCatalogNumber;
          break;
        case "ItemDescription":
          newRow[rowKey] = outerObject.ItemDescription;
          break;
        default:
          newRow[rowKey] = isCopy ? innerArray[arrayIndex][rowKey] : "";
      }
    });
    newRow["isEditRow"] = 1; // adding a condition for edit in a JSON FILE
    return newRow;
  };

  const handleAddRow = () => {
    const newRow = initializeRow();
    setInnerArray([...innerArray, newRow]);
  };

  const options = [];
  const modelOptions = [];

  return (
    <>
      <TableRow
        className="custom-scrollbar"
        // key={parent_id}
        sx={{ "& > *": { borderBottom: "unset" } }}
      >
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
                    // Popup for editing row on save & approve Confirm button
                    if (popupOpen.type === "save&Approve") {
                      EditData("save&Approve");
                    }
                    // Popup for editing row on cancel Confirm button
                    if (popupOpen.type === "cancel") {
                      ResetEditedRow();
                    }
                    // Popup for already exiting row on Approve button
                    if (popupOpen.type === "Approve") {
                      approveData();
                    }
                    // For close popup and menu's and reset count of add or edit row
                    // setDisableColon(false);
                    // setDisableRowOption(false);
                    setArrayIndex(null);
                    setEditClickID(null);
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

        <TableCell className="global_table" sx={{ minWidth: "75px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              aria-label="expand row"
              size="small"
              disableRipple
              // sx={{ p: "20px 5px 20px 0px" }}
              // sx={{ textAlign: "center" }}
              onClick={() => {
                setOpen(!open);
              }}
            >
              {open ? (
                <BiSolidDownArrow style={{ color: "#40434E" }} />
              ) : (
                <BiSolidRightArrow style={{ color: "#40434E" }} />
              )}
            </IconButton>
            {index}
          </Box>
        </TableCell>
        {outerObject && (
          <>
            <TableCell className="global_table" align="center" component="td" scope="row">
              {outerObject?.ManufacturerId ? outerObject?.ManufacturerId : ""}
            </TableCell>
            <TableCell className="global_table" align="center">
              {outerObject?.ManufacturerCatalogNumber
                ? outerObject?.ManufacturerCatalogNumber
                : ""}
            </TableCell>
            <TableCell className="global_table" sx={{ width: "360px" }} align="center">
              {outerObject?.ItemDescription ? outerObject?.ItemDescription : ""}
            </TableCell>
            <TableCell className="global_table" align="center" style={{ minWidth: "auto" }}>
              {outerObject?.TCount ? outerObject?.TCount : 1}
            </TableCell>
          </>
        )}
      </TableRow>
      <TableRow sx={{ pl: 0, mr: 0, border: "none" }}>
        <TableCell className="global_table custom-scrollbar innertable"
          
          style={{
            padding: 0,
            overflowX: "overlay",
            maxWidth: "100px",
            border: "none",
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
            // style={{ margin: 1 }}
            >
              <Table
                size="small"
                aria-label="purchases"
                sx={{ overflowX: "auto" }}
                className="InnerTable"
              >
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell className="global_table"
                        key={column.id}
                        align="center"
                        sx={{
                          bgcolor: "#565960",
                          color: "#fff",
                          minWidth: column.minWidth,
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {innerArray && innerArray.length > 0 ? (
                    innerArray.map((innerRow, ind) => (
                      <TableRow key={innerRow?.uniqueId}>

                        <AlwaysNotEditableFields innerRow={innerRow} />

                        {editClickID === innerRow?.uniqueId ? (
                          columns.slice(4, columns.length - 1).map((column) => (
// ..................Editable Autocomplete for each field.........................................
                            <TableCell className="global_table" key={column.id} sx={{ p: 0 }}>
                              <Autocomplete
                                id={`autocomplete-${column.id}`} // Unique ID for each Autocomplete component
                                freeSolo
                                options={focusedColumn === "model" ? modelOptions : options}
                                // value={innerRow[column.columnKey] ? innerRow[column.columnKey].toString() : ""}
                                // value={
                                //   focusedColumn === column.id
                                //     ? editValue
                                //     : innerRow[column.columnKey]
                                // }
                                value={
                                  focusedColumn === column.id
                                    ? editValue
                                    : innerRow[column.columnKey] !==
                                      undefined
                                    ? innerRow[column.columnKey]
                                    : ""
                                }
                                onInputChange={(event, newValue, reason) => {
                                  // console.log("reason", reason);
                                  // console.log("editValue", newValue);

                                  // Check for reset action means focusing to the field
                                  if(reason === "reset"){
                                    setEditValue(innerRow[column.columnKey])
                                  } else {
                                    // Set new value if not reset
                                    setEditValue(newValue);
                                  }

                                  // Check for input action means input changing to the field
                                  if(reason === "input"){
                                    if (newValue.length >= 100 && newValue.length <= 150 && focusedColumn) {
                                      setSnackbar({
                                        open: true,
                                        severity: "warning",
                                        message:
                                          "You have crossed the limit of 100 characters.",
                                      });
                                    }
                                    if (newValue.length >= 200 && focusedColumn) {
                                      setSnackbar({
                                        open: true,
                                        severity: "error",
                                        message:
                                          "You have reached the maximum limit of 200 characters.",
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
                                  // console.log("focus",column.id)
                                  setFocusedColumn(column.id);
                                  // Reset edit value to the current row data value when the field is focused
                                  // setEditValue(innerRow[column.columnKey]);
                                }}
                                onBlur={() => {
                                  // console.log("blur", editValue);
                                  const cleanString = editValue ? removeSpacesAndNonASCII(editValue) : "";
                                  // console.log("clean",cleanString)
                                  innerRow[column.columnKey] = cleanString;
                                  innerArray[arrayIndex] = innerRow;
                                  setInnerArray(innerArray);
                                  setEditValue("");
                                  setFocusedColumn(null);
                                }}
                                PaperComponent={CustomPaper}
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
                            </TableCell>
                          ))
                        ) : (
                          <>
                            <NotEditableFieldsComponent innerRow={innerRow} />
                            <TableCell className="global_table" align="center">
                              <Tooltip
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      border: "0.5px solid #333",
                                      bgcolor: "#fff",
                                      borderRadius: "10px",
                                      fontSize: "12px",
                                      p: 1,
                                      color: "#333",
                                    },
                                  },
                                }}
                                title={
                                  innerRow?.comment ? innerRow?.comment : ""
                                }
                              >
                                <Typography className="item_description">
                                  {innerRow?.comment
                                    ? innerRow?.comment
                                    : innerRow?.isEditRow
                                    ? innerRow?.comment
                                    : ""}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                          </>
                        )}
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
                                editClickID !== innerRow?.uniqueId
                                  ? undefined
                                  : "You can discard changes without save, go to options."
                              }
                              onClick={async() => {
                                if (editClickID !== innerRow?.uniqueId) {
                                  setEditClickID(innerRow?.uniqueId); // uniqueId set
                                  setArrayIndex(ind); // array index set
                                  // setDisableColon(true);
                                } else {
                                  setSnackbar({
                                    open: true,
                                    severity: "error",
                                    message:
                                      "You can discard changes without save, go to options.",
                                  });
                                }
                                await EventsAPIs(batchId,EDIT_ROW_EXACT)

                              }}
                            />

                            <IconButton
                              onClick={(event) => {
                                // setArrayIndex(ind); // array index set
                                // setUniqueId(innerRow?.uniqueId); // uniqueId set
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

                            {/* Menu Items of IconButton for anchorEl and anchorE2 respectively  */}
                            {anchorEl && (
                              <LongMenu
                                anchorEl={anchorEl}
                                handleClose={handleMenuClose}
                                Items={[
                                  {
                                    text: (
                                      <>
                                        <FcApproval fontSize={19} />
                                        &nbsp; Approve
                                      </>
                                    ),
                                    onClick: async () => {
                                      handleApprove();
                                      await EventsAPIs(batchId,APPROVE_ROW_EXACT)
                                    },
                                  },
                                ]}
                              />
                            )}

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
                                    onClick:async() => {
                                      EditData();
                                      // setDisableColon(false);
                                      // setDisableRowOption(false);
                                      setEditClickID(null);
                                      // setArrayIndex(null);
                                      handleMenuClose();
                                      await EventsAPIs(batchId,SAVE_ROW_EXACT)

                                    },
                                  },
                                  {
                                    text: (
                                      <>
                                        <FcApproval fontSize={19} />
                                        &nbsp; Save & Approve
                                      </>
                                    ),
                                    onClick: async() => {
                                      setPopupOpen({
                                        open: true,
                                        type: "save&Approve",
                                      });
                                      await EventsAPIs(batchId,SAVE_APPROVE_ROW_EXACT)

                                    },
                                  },
                                  {
                                    text: (
                                      <>
                                        <MdCancel
                                          fontSize={19}
                                          color="#E11927"
                                        />
                                        &nbsp; Discard Changes
                                      </>
                                    ),
                                    onClick:async() => {
                                      setPopupOpen({
                                        open: true,
                                        type: "cancel",
                                      });
                                      await EventsAPIs(batchId,DISCARD_CHANGES_EXACT)

                                    },
                                  },
                                ]}
                              />
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="global_table" style={{ textAlign: "center" }} colSpan={7}>
                        Record Not Found
                        <Button
                          size="medium"
                          // variant="contained"
                          // color="secondary"
                          style={{
                            marginLeft: "10px",
                            marginTop: "2px",
                            marginBottom: "2px",
                            fontFamily: "Roboto",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            background: "#E11927",
                            padding: "6px 12px",
                            borderRadius: "11px",
                            color: "white",
                          }}
                          onClick={() => {
                            handleAddRow();
                            handleMenuClose();
                          }}
                        >
                          <IoMdAddCircleOutline fontSize={18} /> &nbsp; Add Row
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </>
  );
};

export default Row;
