import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { BiSolidRightArrow } from "react-icons/bi";
import { BiSolidDownArrow } from "react-icons/bi";
import { BiSolidEdit } from "react-icons/bi";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import { FiSave } from "react-icons/fi";
import { FcApproval } from "react-icons/fc";
import { MdCancel } from "react-icons/md";
import Popup from "ui-component/components/Popup";
import { Button, Menu, MenuItem, TextField, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import "./style.css";
import LongMenu from "ui-component/menu-cluster/ClusterMenu";
import Loading from "ui-component/components/Loading";
import Message from "ui-component/components/Snackbar/Snackbar";
import Axios from "api/Axios";
import { API } from "api/API";

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

const Row = ({
  parent_id,
  defaultArray,
  outerObject,
  index,
  company,
  GetCompanyData,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const columns = [
    { id: "mf_id", columnKey: "ManufacturerId", label: "ManufacturerId" },
    {
      id: "mf_catlog",
      columnKey: "ManufacturerCatalogNumber",
      label: "MCN",
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
    { id: "action", columnKey: "Action", label: "Action" },
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [innerArray, setInnerArray] = useState(defaultArray);
  const [arrayIndex, setArrayIndex] = useState();
  const [popupOpen, setPopupOpen] = useState({
    open: false,
    type: "save&approve/cancel",
  });
  const [isEditClick, setIsEditClick] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [focusedColumn, setFocusedColumn] = useState(null);
  const [totalRow, setTotalRow] = useState({ addRow: 0, editRow: 0 });
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

  const saveInJSONFile = async (iscopy, copiedData) => {
    // GET LAST ROW FROM ARRAY AND SAVE THAT
    const data = {
      filename: `${company}.json`,
      key: { parent_id: parent_id, iscopy },
      details: iscopy ? copiedData : innerArray[innerArray.length - 1],
    };
    // console.log("new row added", data);
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Save_Company_Data, data);
      if (res) {
        setSnackbar({
          open: true,
          message: res.data.message,
        });
        setInnerArray(res.data.innerArray);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in saving file", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.message,
      });
      setIsLoading(false);
    }
  };

  const approve_OR_saveApprove = async (uniqueId) => {
    let data = {
      filename: `${company}.json`,
      key: {
        parent_id: parent_id,
        uniqueId: uniqueId ? UniqueId : "",
        action: uniqueId ? "approve" : "saveAndApprove",
      },
      details: uniqueId ? { approvel_status: 1 } : innerArray[arrayIndex],
    };
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Approve_OR_SaveApprove, data);
      if (res) {
        setSnackbar({
          open: true,
          message: res.data.message,
        });
        setTimeout(() => {
          GetCompanyData(company);
        }, 1000);
        // setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in approve or save&approve file", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.message,
      });
      setIsLoading(false);
    }
  };

  const Save_Edited_Data = async () => {
    const data = {
      filename: `${company}.json`,
      key: { parent_id: parent_id, uniqueId: UniqueId },
      details: innerArray[arrayIndex],
    };
    // console.log("double edited data",data)
    try {
      setIsLoading(true);
      const res = await Axios.post(API.Save_Edited_Company_Data, data);
      if (res) {
        setSnackbar({
          open: true,
          message: res.data.message,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log("ERROR in saving file", error);
      setSnackbar({
        open: true,
        severity: "error",
        message: error.message,
      });
      setIsLoading(false);
    }
  };

  const removeFromArray = async (index) => {
    // if (UniqueId === undefined || UniqueId === "" || UniqueId === null)
    if (!UniqueId) {
      setInnerArray(innerArray.slice(0, innerArray.length - 1));
    } else {
      try {
        let data = {
          filename: `${company}.json`,
          key: { parent_id: parent_id, uniqueId: UniqueId },
        };
        setIsLoading(true);
        const res = await Axios.post(API.Delete_Row, data);
        if (res?.data) {
          setInnerArray(res?.data?.innerArray);
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
          message: error.message,
        });
      }
      setIsLoading(false);
    }
  };

  const ResetTotalRows = () => {
    if (totalRow.addRow === 1 && totalRow.editRow === 1) {
      setTotalRow({
        addRow: 0,
        editRow: 0,
      });
    }
    if (totalRow.addRow === 1 && totalRow.editRow === 0) {
      setTotalRow({
        ...totalRow,
        addRow: 0,
      });
    }
    if (totalRow.editRow === 1 && totalRow.addRow === 0) {
      setTotalRow({
        ...totalRow,
        editRow: 0,
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
    // console.log("arr",innerArray)
    // console.log("ind",arrayIndex)
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
    if (totalRow.addRow === 1) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please save current row, Max 1 row can be added",
      });
      return;
    } else {
      const newRow = initializeRow();
      setInnerArray([...innerArray, newRow]);
      setTotalRow({ ...totalRow, addRow: 1 });
    }
  };

  return (
    <>
      <TableRow
        className="custom-scrollbar"
        // key={parent_id}
        sx={{ "& > *": { borderBottom: "unset" } }}
      >
        <TableCell sx={{ minWidth: "75px" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
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
            <TableCell align="center" component="td" scope="row">
              {outerObject?.ManufacturerId
                ? outerObject?.ManufacturerId
                : "N/A"}
            </TableCell>
            <TableCell align="center">
              {outerObject?.ManufacturerCatalogNumber
                ? outerObject?.ManufacturerCatalogNumber
                : "N/A"}
            </TableCell>
            <TableCell sx={{ width: "360px" }}>
              {outerObject?.ItemDescription
                ? outerObject?.ItemDescription
                : "N/A"}
            </TableCell>
          </>
        )}
      </TableRow>
      <TableRow sx={{ pl: 0, mr: 0, border: "none" }}>
        <TableCell
          className="custom-scrollbar innertable"
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
                      <TableCell
                        key={column.uniqueId}
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
                        <TableCell component="td" scope="row">
                          {innerRow?.ManufacturerId
                            ? innerRow?.ManufacturerId
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {innerRow?.ManufacturerCatalogNumber
                            ? innerRow?.ManufacturerCatalogNumber
                            : "N/A"}
                        </TableCell>
                        <TableCell>
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
                                : "N/A"}
                            </Typography>
                          </Tooltip>
                        </TableCell>

                        {innerRow?.isEditRow &&
                          isEditClick === innerRow?.uniqueId &&
                          columns.slice(3, columns.length - 1).map((column) => (
                            <TableCell key={column.id} sx={{ p: 0 }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name={column.label}
                                type="text"
                                // defaultValue={innerRow[column?.label]}
                                value={
                                  focusedColumn === column.id
                                    ? editValue
                                    : innerRow[column.columnKey]
                                }
                                onChange={(e) => {
                                  setEditValue(e.target.value);
                                  // console.log("inde", arrayIndex)
                                }}
                                onFocus={() => {
                                  setFocusedColumn(column.id);
                                  setEditValue(innerRow[column.columnKey]);
                                }}
                                onBlur={() => {
                                  innerRow[column.columnKey] = editValue;
                                  innerArray[arrayIndex] = innerRow;
                                  setInnerArray(innerArray);
                                  setEditValue("");
                                  setFocusedColumn(null);
                                }}
                                className={classes.textField}
                                // className="Shavim"
                                InputProps={{ className: "InputProps" }}
                                inputProps={{ className: "inputPropsInner" }} // this is for design in input, inside textField
                              />
                            </TableCell>
                          ))}

                        {innerRow?.uniqueId !== isEditClick && (
                          <>
                            <TableCell>
                              {innerRow?.Company
                                ? innerRow?.Company
                                : innerRow?.isEditRow
                                ? innerRow?.Company
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {innerRow?.Group
                                ? innerRow?.Group
                                : innerRow?.isEditRow
                                ? innerRow?.Group
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {innerRow?.Business
                                ? innerRow?.Business
                                : innerRow?.isEditRow
                                ? innerRow?.Business
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {innerRow?.Division
                                ? innerRow?.Division
                                : innerRow?.isEditRow
                                ? innerRow?.Division
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {innerRow?.Therapy
                                ? innerRow?.Therapy
                                : innerRow?.isEditRow
                                ? innerRow?.Therapy
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {innerRow?.Specialty
                                ? innerRow?.Specialty
                                : innerRow?.isEditRow
                                ? innerRow?.Specialty
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {innerRow?.Anatomy
                                ? innerRow?.Anatomy
                                : innerRow?.isEditRow
                                ? innerRow?.Anatomy
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {innerRow?.SubAnatomy
                                ? innerRow?.SubAnatomy
                                : innerRow?.isEditRow
                                ? innerRow?.SubAnatomy
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {innerRow?.ProductCategory
                                ? innerRow?.ProductCategory
                                : innerRow?.isEditRow
                                ? innerRow?.ProductCategory
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {innerRow?.ProductFamily
                                ? innerRow?.ProductFamily
                                : innerRow?.isEditRow
                                ? innerRow?.ProductFamily
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {innerRow?.Model
                                ? innerRow?.Model
                                : innerRow?.isEditRow
                                ? innerRow?.Model
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {innerRow?.productCode
                                ? innerRow?.productCode
                                : innerRow?.isEditRow
                                ? innerRow?.productCode
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {innerRow?.productCodeName
                                ? innerRow?.productCodeName
                                : innerRow?.isEditRow
                                ? innerRow?.productCodeName
                                : "N/A"}
                            </TableCell>
                          </>
                        )}
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
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
                                content="Are you sure you want to proceed"
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
                                          approve_OR_saveApprove();
                                        }
                                        // Popup for editing row on cancel Confirm button
                                        if (popupOpen.type === "cancel") {
                                          removeFromArray();
                                        }
                                        // Popup for already exiting row on Approve button
                                        if (popupOpen.type === "Approve") {
                                          approve_OR_saveApprove(UniqueId);
                                          setArrayIndex(null);
                                        }
                                        // For close popup and menu's and reset count of add or edit row
                                        ResetTotalRows();
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

                            {innerRow?.isEditRow !== undefined &&
                              innerRow?.isEditRow === 1 && (
                                <BiSolidEdit
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "20px",
                                  }}
                                  onClick={() => {
                                    if (totalRow.editRow === 1) {
                                      setSnackbar({
                                        open: true,
                                        severity: "error",
                                        message:
                                          "Please save current row first",
                                      });
                                    } else {
                                      setIsEditClick(innerRow?.uniqueId); // uniqueId set
                                      setTotalRow({ ...totalRow, editRow: 1 });
                                      setArrayIndex(ind); // array index set
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
                              onClick={(event) => {
                                setArrayIndex(ind); // array index set
                                if (innerRow?.isEditRow === undefined) {
                                  setAnchorEl(event.currentTarget);
                                  setUniqueId(innerRow?.uniqueId); // uniqueId set
                                } else {
                                  setAnchorE2(event.currentTarget);
                                  setUniqueId(innerRow?.uniqueId);
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
                            {/* Menu Items of IconButton respectively  */}
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
                                    onClick: () => {
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
                                    onClick: () => {
                                      handleAddRow();
                                      handleMenuClose();
                                    },
                                  },
                                  {
                                    text: (
                                      <>
                                        <MdOutlineContentCopy fontSize={18} />
                                        &nbsp; Copy Row
                                      </>
                                    ),
                                    onClick: () => {
                                      const copyRow = initializeRow(true);
                                      saveInJSONFile(1, copyRow);
                                      setIsEditClick("");
                                      setArrayIndex(null);
                                      handleMenuClose();
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
                                      onClick: () => {
                                        // Save_Edited_Data();
                                        // if (totalRow.editRow === 1) {
                                        //   setTotalRow({ editRow: 0 });
                                        // }
                                        // setIsEditClick("");
                                        // setArrayIndex(null);
                                        // handleMenuClose();
                                        if (UniqueId) {
                                          Save_Edited_Data();
                                        } else {
                                          saveInJSONFile();
                                        }

                                        ResetTotalRows();
                                        setIsEditClick("");
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
                                      onClick: () => {
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
                                          &nbsp; Cancel
                                        </>
                                      ),
                                      onClick: () => {
                                        setPopupOpen({
                                          open: true,
                                          type: "cancel",
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
                      <TableCell style={{ textAlign: "center" }} colSpan={7}>
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
