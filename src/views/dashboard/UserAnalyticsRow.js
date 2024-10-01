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
import { makeStyles } from "@mui/styles";

// Icons
import { BiSolidRightArrow, BiSolidDownArrow } from "react-icons/bi";

// Components
import "./style.css";
import "../pages/ClusteredMatches/style.css";

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

// Utility function to split array into chunks
const chunkArray = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const UserAnalyticsRow = ({
  columns,
  InnerColumns,
  outerObject,
  defaultArray,
  Index,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [innerArray, setInnerArray] = useState(defaultArray);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

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
  };

  const createSortHandler = (property) => {
    let newOrder = "asc";
    if (orderBy === property) {
      newOrder = order === "asc" ? "desc" : "asc";
    }

    const sortedData = innerArray.sort((a, b) => {
      const extractAlphanumeric = (str) =>
        str.toString().replace(/[^0-9a-zA-Z]/g, "");

      const aAlphanumeric = extractAlphanumeric(a[property]);
      const bAlphanumeric = extractAlphanumeric(b[property]);

      if (newOrder === "asc") {
        return aAlphanumeric.localeCompare(bAlphanumeric, undefined, {
          numeric: true,
        });
      } else {
        return bAlphanumeric.localeCompare(aAlphanumeric, undefined, {
          numeric: true,
        });
      }
    });

    setOrder(newOrder);
    setOrderBy(property);
    setInnerArray([...sortedData]); // Spread to ensure state update
  };

  return (
    <>
      <TableRow
        className="custom-scrollbar"
        // key={parent_id}
        // sx={{ "& > *": { borderBottom: "unset" } }}
        sx={{ background: Index % 2 !== 0 ? "" : "#F1F4F9" }}
      >
        <TableCell sx={{ minWidth: "75px" }}>
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
            {Index}
          </Box>
        </TableCell>
        {outerObject &&
          columns.map((column) => (
            <TableCell
              key={Index + column.id}
              // className="global_table"
              align="center"
            >
              {column?.columnKey === "FillAllPercentage" ? (
                `${outerObject[column?.columnKey] ?? 0}%`
              ) : column?.columnKey === "Company" ? (
                // (<Typography className="custom-scrollbar analytics userAnal_companies" sx={{display:"flex", flexWrap: outerObject[column?.columnKey].length > 5 ? "wrap":"", overflowY:"auto",maxHeight: 85,height:"100%"}}>
                //   {outerObject[column?.columnKey].map((item) => (
                //   <Typography className="userAnal_companies1">{item}</Typography>
                // ))}
                // </Typography> )
                <Typography
                  className="custom-scrollbar analytics userAnal_companies"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    maxHeight: 85,
                    height: "100%",
                  }}
                >
                  {chunkArray(outerObject[column?.columnKey], 5).map(
                    (chunk, index) => (
                      <div
                        key={index}
                        className="userAnal_companies"
                        style={{ display: "flex", flexWrap: "wrap" }}
                      >
                        {chunk.map((item, idx) => (
                          <Typography key={idx} className="userAnal_companies1">
                            {item}
                          </Typography>
                        ))}
                      </div>
                    )
                  )}
                </Typography>
              ) : (
                outerObject[column?.columnKey] ?? 0
              )}
            </TableCell>
          ))}
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
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
            // style={{ margin: 1 }}
            >
              <Table
                // size="small"
                aria-label="purchases"
                className="userAn"
                sx={{ overflowX: "auto" }}
                // className="InnerTable table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        textAlign: "center",
                        background: "#40434e38",
                        fontWeight: 600,
                      }}
                      colSpan={6}
                    >
                      Fill All Records Listing
                    </TableCell>
                    <TableCell
                      style={{ background: "#40434e38" }}
                      colSpan={12}
                    ></TableCell>
                  </TableRow>
                  <TableRow>
                    {InnerColumns.map((column) => (
                      <TableCell
                        // className="global_table"
                        key={column.id}
                        align="center"
                        sx={{
                          width: "auto !important",
                          minWidth: "177px",
                          maxWidth: "200px",
                        }}
                      >
                        {column.label}
                        {innerArray.length > 1 && (
                          <TableSortLabel
                            active={orderBy === column.columnKey}
                            direction={
                              orderBy === column.columnKey ? order : "asc"
                            }
                            onClick={() => {
                              createSortHandler(column.columnKey);
                            }}
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {innerArray && innerArray.length > 0 ? (
                    innerArray.map((innerRow, ind) => (
                      <TableRow key={ind}>
                        {InnerColumns.map((item, index) => (
                          <TableCell
                            key={Index + index + item.id}
                            // className="global_table"
                            align="center"
                          >
                            {innerRow[item?.columnKey] ?? ""}
                          </TableCell>
                        ))}
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
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default UserAnalyticsRow;
