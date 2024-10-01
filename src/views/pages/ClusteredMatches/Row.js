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
  Avatar,
} from "@mui/material";
import { FaAnglesRight } from "react-icons/fa6";
import { makeStyles } from "@mui/styles";

// Icons
import {
  BiSolidRightArrow,
  BiSolidDownArrow,
  BiSolidEdit,
} from "react-icons/bi";
import { MdOutlineContentCopy, MdCancel } from "react-icons/md";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { IoMdAddCircleOutline, IoMdSearch } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import { FcApproval } from "react-icons/fc";
import { GiNotebook } from "react-icons/gi";

// Components
import Popup from "ui-component/components/Popup";
import "./style.css";
import LongMenu from "ui-component/menu-cluster/ClusterMenu";
import Loading from "ui-component/components/Loading";
import Message from "ui-component/components/Snackbar/Snackbar";
import Axios from "api/Axios";
import { API } from "api/API";
import { columns, requiredKeys } from "./ClusteredColumns";
import { useRef } from "react";
import { EventsAPIs, removeSpacesAndNonASCII } from "utils/global_functions";
import {
  ADD_ROW_CLUSTERED,
  APPROVE_ROW_CLUSTERED,
  COPY_ROW_CLUSTERED,
  DELETE_ROW_CLUSTERED,
  EDIT_ROW_CLUSTERED,
  FILL_ALL_FIELDS_CLUSTERED,
  SAVE_APPROVE_ROW_CLUSTERED,
  SAVE_ROW_CLUSTERED,
  WEB_SEARCH_CLUSTERED,
} from "store/actions";

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
      // "& .MuiInputBase-input": {
      //   padding: 0,
      // },
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

const NotEditableFieldsComponent = ({ innerRow }) =>
  columns.slice(4, columns.length - 2).map((column) => (
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
  GetCompanyData,
  setPage,
  onRef,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [anchorE3, setAnchorE3] = useState(null);
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
  const [previousRow, setPreviousRow] = useState();

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
    setAnchorE3(null);
  };

  const AddEditCopyData = async (iscopy, copiedData) => {
    // GET LAST ROW FROM ARRAY AND SAVE THAT
    let AllfieldsMandatory = "";
    const data = {
      obj_id: parent_id,
      uniqueId: UniqueId,
      action: iscopy ? "copy" : UniqueId ? "edit" : "add",
      details: iscopy
        ? copiedData
        : UniqueId
        ? innerArray[arrayIndex]
        : innerArray[innerArray.length - 1],
    };
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Add_Edit_Copy_Company_Data, data);
      if (res) {
        setSnackbar({
          open: true,
          message: res.data.message,
        });
        setInnerArray([...res.data.clusteredPoints]);
        setIsLoading(false);
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

  const approve_OR_saveApprove = async (uniqueId) => {
    let AllfieldsMandatory = "";
    let data = {
      obj_id: parent_id,
      uniqueId: uniqueId ? UniqueId : "",
      action: uniqueId ? "approve" : "saveAndApprove",
      details: uniqueId ? { approvel_status: 1 } : innerArray[arrayIndex],
      created_date: outerObject?.created_date,
      batchId,
      email: JSON.parse(localStorage.getItem("Profile_Details"))?.email,
    };
    // console.log("inner",data)

    let obj = innerArray[arrayIndex];
    for (let field of requiredKeys) {
      if (!obj[field]) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Please fill out all the fields first",
        });
        AllfieldsMandatory = "true";
        break; // Exit the loop early since we already found an empty field
      }
    }

    if (AllfieldsMandatory === "true") {
      console.log(innerArray[arrayIndex]);
    } else {
      try {
        setIsLoading(true);
        const res = await Axios.post(API.Approve_OR_SaveApprove, data);
        if (res) {
          setSnackbar({
            open: true,
            message: res.data.message,
          });
          if (data?.action === "saveAndApprove") {
            await compareFillAllValues(data?.details);
            await EventsAPIs(batchId, SAVE_APPROVE_ROW_CLUSTERED);
          }else{
            await EventsAPIs(batchId, APPROVE_ROW_CLUSTERED);
          }

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
    }
  };

  const removeFromArray = async (index) => {
    // if (UniqueId === undefined || UniqueId === "" || UniqueId === null)
    if (!UniqueId) {
      setInnerArray(innerArray.slice(0, -1));
    } else {
      try {
        let data = {
          obj_id: parent_id,
          uniqueId: UniqueId,
        };
        setIsLoading(true);
        const res = await Axios.post(API.Delete_Row, data);
        if (res?.data) {
          setInnerArray([...res?.data?.clusterPoints]);
          setSnackbar({
            open: true,
            message: res?.data?.message,
          });
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
      }
      setIsLoading(false);
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
          newRow[rowKey] = `${outerObject?.ManufacturerId}`;
          break;
        case "ManufacturerCatalogNumber":
          newRow[rowKey] = outerObject?.ManufacturerCatalogNumber;
          break;
        case "ItemDescription":
          newRow[rowKey] = outerObject?.ItemDescription;
          break;
        case "Company":
          newRow[rowKey] = outerObject?.Company;
          break;
        default:
          newRow[rowKey] = isCopy ? innerArray[arrayIndex][rowKey] : "";
      }
    });
    newRow["isEditRow"] = 1; // adding a condition for edit in a JSON FILE
    return newRow;
  };

  const isValueOfRowChanged = () => {
    const currentRow = innerArray[arrayIndex];
    let flag = false;

    if (!previousRow) {
      return flag;
    }
    columns.slice(4, columns.length - 1).forEach((item, index) => {
      if (currentRow[item.columnKey] !== previousRow[item.columnKey]) {
        flag = true;
      }
    });
    return flag;
  };

  const compareFillAllValues = async (fillObject) => {
    let keys = requiredKeys.slice(4);
    keys.push("comment");

    let flag = keys.every((item) => {
      switch (item) {
        case "Model":
        case "comment":
          return fillObject[item].trim() !== "" && fillObject[item].trim() === "-";
        default:
          return fillObject[item].trim() !== "" && fillObject[item].trim() === "Other";
      }
    });

    if (flag) {
      await EventsAPIs(batchId, FILL_ALL_FIELDS_CLUSTERED);
    }
  };

  const FillEmptyCells = () => {
    // Clone innerArray to ensure immutability
    const newInnerArray = [...innerArray];
    let newRow = { ...newInnerArray[arrayIndex] };
    // console.log("my prev",previousRow)
    // Clone newRow before setting it as previousRow
    setPreviousRow({ ...newRow });

    columns.slice(0, columns.length - 1).forEach((item) => {
      const rowKey = item.columnKey;
      switch (rowKey) {
        case "Model":
        case "comment":
          newRow[rowKey] = innerArray[arrayIndex][rowKey]
            ? innerArray[arrayIndex][rowKey]
            : "-";
          break;
        default:
          newRow[rowKey] = innerArray[arrayIndex][rowKey]
            ? innerArray[arrayIndex][rowKey]
            : "Other";
      }
    });

    // Adding a condition for edit in a JSON FILE
    newRow["isEditRow"] = 1;

    // Update the innerArray state
    setInnerArray((prevState) => {
      return prevState.map((item, i) => {
        if (i === arrayIndex) {
          return newRow;
        }
        return item;
      });
    });
    return newRow;
  };

  const handleAddRow = () => {
    let newRow = initializeRow();
    // console.log("inner", innerArray);
    setInnerArray([...innerArray, newRow]);
    return newRow;
  };

  const scrollbarRef = useRef(null);
  const handleScrollbarClick = (event) => {
    if (scrollbarRef.current) {
      const scrollDistance = scrollbarRef.current.scrollWidth;
      // console.log(scrollDistance, "nice");
      setTimeout(() => {
        scrollbarRef.current.scrollLeft = scrollDistance;
      }, 0);
    }
  };

  const QueryString = (searchString) => {
    let query = searchString;
    query = encodeURIComponent(query).replace(/[!'()*&, ]/g, (char) => {
      return "%" + char.charCodeAt(0).toString(16);
    });
    return query;
  };

  const handleLink = async () => {
    let Company_String = await QueryString(outerObject?.Company);
    let MCN_String = await QueryString(outerObject?.ManufacturerCatalogNumber);
    let ItemDes_String = await QueryString(outerObject?.ItemDescription);
    window.open(
      `https://www.google.com/search?q=${Company_String}+${MCN_String}+${ItemDes_String}`,
      "_blank"
    );
    // window.open(`https://www.google.com/search?q=${outerObject?.Company}+${outerObject?.ManufacturerCatalogNumber}+${outerObject?.ItemDescription}`, '_blank');
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
                  disabled={isLoading}
                  onClick={async () => {
                    // Popup for editing row on save & approve Confirm button
                    if (popupOpen.type === "save&Approve") {
                      approve_OR_saveApprove();
                    }
                    // Popup for editing row on cancel Confirm button
                    if (popupOpen.type === "delete") {
                      removeFromArray();
                    }
                    // Popup for already exiting row on Approve button
                    if (popupOpen.type === "Approve") {
                      approve_OR_saveApprove(UniqueId);
                    }
                    // Popup for filling all cells without information (other)
                    if (popupOpen.type === "fill_all_cells") {
                      // console.log(UniqueId,"fill all values")
                      // const filledRow = initializeRow(2);
                      // let newArray = innerArray.slice(0, -1);
                      // setInnerArray([...newArray,filledRow]);
                      const newRow = FillEmptyCells();
                      setEditClickID(null); // operated data deleted from that table, so not show already edited row
                    }
                    // For close popup and menu's and reset count of add or edit row
                    setDisableColon(false);
                    setDisableRowOption(false);
                    setArrayIndex(null);
                    // setEditClickID(null)    // operated data deleted from that table, so not show already edited row
                    // and working fine on fill_all__cells
                    // setUniqueId(null)       // Commented because it use for colons only and it only effect the
                    // colon's options but every time popup close after performed any operation and we need to
                    // reopen it for other operations again its click uniqueId set.
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
            <TableCell
              className="global_table"
              align="center"
              component="td"
              scope="row"
            >
              {outerObject?.ManufacturerId ? outerObject?.ManufacturerId : ""}
            </TableCell>
            <TableCell className="global_table" align="center">
              {outerObject?.ManufacturerCatalogNumber
                ? outerObject?.ManufacturerCatalogNumber
                : ""}
            </TableCell>
            <TableCell className="global_table" sx={{ width: "360px" }}>
              {outerObject?.ItemDescription ? outerObject?.ItemDescription : ""}
            </TableCell>
            <TableCell
              className="global_table"
              align="center"
              style={{ minWidth: "auto" }}
            >
              {outerObject?.TCount ? outerObject?.TCount : 1}
            </TableCell>
            <TableCell className="global_table" align="center">
              {/* <FaExternalLinkAlt
                style={{ cursor: "pointer", color: "#1054ad" }}
                onClick={handleLink}
              /> */}
              <IconButton onClick={(event) => setAnchorE3(event.currentTarget)}>
                <IoEllipsisVerticalSharp
                  style={{
                    cursor: "pointer",
                    fontSize: "17px",
                  }}
                />
              </IconButton>
              {anchorE3 && (
                <LongMenu
                  anchorEl={anchorE3}
                  handleClose={handleMenuClose}
                  Items={[
                    {
                      text: (
                        <>
                          <IoMdSearch fontSize={18} color="#1054ad" />
                          &nbsp; Search
                        </>
                      ),
                      onClick: async () => {
                        handleLink();
                        handleMenuClose();
                        await EventsAPIs(batchId, WEB_SEARCH_CLUSTERED);
                      },
                    },
                  ]}
                />
              )}
            </TableCell>
          </>
        )}
      </TableRow>
      <TableRow sx={{ pl: 0, mr: 0, border: "none" }}>
        <TableCell
          className="global_table custom-scrollbar innertable"
          style={{
            padding: 0,
            overflowX: "overlay",
            maxWidth: "100px",
            border: "none",
          }}
          colSpan={6}
          // onClick={handleScrollbarClick}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
            // style={{ margin: 1 }}
            >
              <Table
                size="small"
                aria-label="purchases"
                sx={{ overflowX: "auto" }}
                className="InnerTable table"
                ref={onRef}
              >
                <TableHead className="head">
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        className="global_table"
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
                        <TableCell
                          className="global_table"
                          component="td"
                          align="center"
                          scope="row"
                        >
                          {innerRow?.ManufacturerId
                            ? innerRow?.ManufacturerId
                            : ""}
                        </TableCell>
                        <TableCell className="global_table" align="center">
                          {innerRow?.ManufacturerCatalogNumber
                            ? innerRow?.ManufacturerCatalogNumber
                            : ""}
                        </TableCell>
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
                          </Tooltip>
                        </TableCell>
                        <TableCell className="global_table" align="center">
                          {innerRow?.Company ? innerRow?.Company : ""}
                        </TableCell>

                        {editClickID === innerRow?.uniqueId ? (
                          <>
                            {innerRow?.isEditRow !== 1 && (
                              <NotEditableFieldsComponent innerRow={innerRow} />
                            )}
                            {columns
                              .slice(
                                innerRow?.isEditRow === 1
                                  ? 4
                                  : columns.length - 2, //this is only last field slice(start) (Notes: editable field)
                                columns.length - 1
                              )
                              .map((column) => (
// ..................Editable Autocomplete for each field........................................
                                <TableCell
                                  className="global_table"
                                  key={column.id}
                                  sx={{ p: 0 }}
                                >
                                  <Autocomplete
                                    id={`autocomplete-${column.id}`} // Unique ID for each Autocomplete component
                                    freeSolo
                                    options={
                                      focusedColumn === "model"
                                        ? modelOptions
                                        : options
                                    }
                                    // OnInputChange of reason is working with value instead of inputValue
                                    // value={innerRow[column.columnKey] ? innerRow[column.columnKey].toString() : ""}
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
                                        // console.log("reset",column.id)
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
                                    PaperComponent={CustomPaper}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="outlined"
                                        name={column.label}
                                        type="text"
                                        className={classes.textField}
                                        // autoComplete="off"
                                        onFocus={() => {
                                          // console.log("focus",column.id)
                                          setFocusedColumn(column.id);
                                          // Reset edit value to the current row data value when the field is focused
                                          // setEditValue(innerRow[column.columnKey]);
                                        }}
                                        onBlur={() => {
                                          // console.log("blur", editValue);
                                          const cleanString = editValue ? removeSpacesAndNonASCII(editValue) : "";
                                          const updatedInnerArray = [...innerArray]; // Create a new array
                                          const updatedInnerRow = {...innerRow}; // Create a new object for the inner row
                                          updatedInnerRow[column.columnKey] = cleanString;
                                          updatedInnerArray[arrayIndex] = updatedInnerRow;
                                          setInnerArray(updatedInnerArray);
                                          setEditValue("");
                                          setFocusedColumn(null);
                                        }}
                                        inputProps={{
                                          ...params.inputProps,
                                          maxLength: focusedColumn ? 200 : undefined,
                                        }}
                                      />
                                    )}
                                  />
                                </TableCell>
                              ))}
                          </>
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

                            {innerRow?.isEditRow !== undefined &&
                              innerRow?.isEditRow === 1 && (
                                <BiSolidEdit
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "20px",
                                  }}
                                  // title={disableColon ? ((editClickID === innerRow?.uniqueId && innerRow?.isEditRow === 1) ? undefined : "Already editing the row.") : undefined}
                                  onClick={async () => {
                                    if (!disableColon) {
                                      setEditClickID(innerRow?.uniqueId); // uniqueId set
                                      setDisableColon(true);
                                      setArrayIndex(ind); // array index set
                                      setPreviousRow(innerRow);
                                    } else {
                                      setSnackbar({
                                        open: true,
                                        severity: "error",
                                        message: "Already editing the row.",
                                      });
                                    }
                                  }}
                                />
                              )}

                            <IconButton
                              // id="long-button"
                              // aria-controls={
                              //   openMenu ? "long-menu" : undefined
                              // }
                              // aria-expanded={openMenu ? "true" : undefined}
                              // disabled={
                              //   disableColon
                              //     ? editClickID === innerRow?.uniqueId &&
                              //       innerRow?.isEditRow === 1
                              //       ? false
                              //       : true
                              //     : false
                              // }
                              disabled={
                                disableColon &&
                                editClickID !== innerRow?.uniqueId
                                  ? true
                                  : false
                              }
                              onClick={(event) => {
                                // console.log("prv", previousRow)
                                setArrayIndex(ind); // array index set
                                setUniqueId(innerRow?.uniqueId); // uniqueId set
                                // console.log(innerRow?.uniqueId);
                                if (innerRow?.isEditRow === undefined) {
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
                            {innerRow?.isEditRow === undefined && anchorEl && (
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
                                    },
                                  },
                                  {
                                    text: (
                                      <>
                                        <IoMdAddCircleOutline fontSize={18} />
                                        &nbsp; Add Row
                                      </>
                                    ),
                                    isDisable: disableRowOption ? true : false,
                                    onClick: async () => {
                                      // console.log("heloo");
                                      const newRow = handleAddRow();
                                      setDisableRowOption(true);
                                      handleMenuClose();
                                      // Below condition for making added row editable
                                      setEditClickID(undefined)
                                      setDisableColon(true)
                                      setPreviousRow(newRow);
                                      setArrayIndex(innerArray.length)
                                      // await EventsAPIs(
                                      //   batchId,
                                      //   ADD_ROW_CLUSTERED
                                      // );
                                    },
                                  },
                                  {
                                    text: (
                                      <>
                                        <MdOutlineContentCopy fontSize={18} />
                                        &nbsp; Copy Row
                                      </>
                                    ),
                                    onClick: async () => {
                                      // const copyRow = initializeRow(true);
                                      const copyRow = initializeRow(1);
                                      await AddEditCopyData(1, copyRow);
                                      setDisableRowOption(false);
                                      setEditClickID(null);
                                      setArrayIndex(null);
                                      handleMenuClose();
                                      await EventsAPIs(
                                        batchId,
                                        COPY_ROW_CLUSTERED
                                      );
                                    },
                                  },
                                ]}
                              />
                            )}

                            {innerRow?.isEditRow !== undefined &&
                              innerRow?.isEditRow == 1 &&
                              anchorE2 && (
                                <LongMenu
                                  anchorEl={anchorE2}
                                  handleClose={handleMenuClose}
                                  Items={[
                                    {
                                      text: (
                                        <>
                                          <FiSave
                                            fontSize={18}
                                            color="#40434E"
                                          />
                                          &nbsp; Save
                                        </>
                                      ),
                                      onClick: async () => {
                                        // const isChanges = isValueOfRowChanged()
                                        // console.log("id",editClickID, "isChange", isChanges)
                                        if (isValueOfRowChanged()) {
                                          await AddEditCopyData();
                                          await EventsAPIs(batchId, SAVE_ROW_CLUSTERED);
                                          setPreviousRow(null);
                                        } else {
                                          // No rows were edited, show a message or handle as needed
                                          setSnackbar({
                                            open: true,
                                            severity: "warning",
                                            message:
                                              "No changes were made to any row.",
                                          });
                                        }
                                        setDisableColon(false);
                                        setDisableRowOption(false);
                                        setEditClickID(null);
                                        setArrayIndex(null);
                                        handleMenuClose();
                                      },
                                    },
                                    {
                                      text: (
                                        <>
                                          <FcApproval fontSize={19} />
                                          &nbsp; Save & Approve
                                        </>
                                      ),
                                      onClick: async () => {
                                        setPopupOpen({
                                          open: true,
                                          type: "save&Approve",
                                        });
                                      },
                                    },
                                    {
                                      text: (
                                        <>
                                          <MdCancel
                                            fontSize={19}
                                            color="#E11927"
                                          />
                                          &nbsp; Delete
                                        </>
                                      ),
                                      onClick: async () => {
                                        setPopupOpen({
                                          open: true,
                                          type: "delete",
                                        });
                                        await EventsAPIs(
                                          batchId,
                                          DELETE_ROW_CLUSTERED
                                        );
                                      },
                                    },
                                    {
                                      text: (
                                        <>
                                          <GiNotebook fontSize={19} />
                                          &nbsp; Fill All Fields
                                        </>
                                      ),
                                      onClick: async () => {
                                        setPopupOpen({
                                          open: true,
                                          type: "fill_all_cells",
                                        });
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
                      <TableCell
                        className="global_table"
                        style={{ textAlign: "center" }}
                        colSpan={7}
                      >
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
                          onClick={async () => {
                            const newRow = handleAddRow();
                            handleMenuClose();
                            // Below condition for making added row editable
                            setEditClickID(undefined)
                            setDisableColon(true)
                            setPreviousRow(newRow);
                            setArrayIndex(innerArray.length)
                            // await EventsAPIs(batchId, ADD_ROW_CLUSTERED);
                          }}
                        >
                          <IoMdAddCircleOutline fontSize={18} /> &nbsp; Add Row
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* <Avatar
                variant="circular"
                  sx={{
                    width: "30px",
                    height: "30px",
                    cursor: "pointer",
                    // textAlign: "right",
                  }}
                  className="rightT"
                  onClick={handleScrollbarClick}
                >
                  <FaAnglesRight />
                </Avatar> */}
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
