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

const FillAllRow = ({
  columns,
  InnerColumns,
  outerObject,
  defaultArray,
  innerArray,
  Index,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  // const [innerArray, setInnerArray] = useState(defaultArray);
  // console.log("default ",defaultArray)
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
              {column?.columnKey === "FillAllPercentage"
                ? `${outerObject[column?.columnKey] ?? 0}%`
                : outerObject[column?.columnKey] ?? 0}
            </TableCell>
          ))}
      </TableRow>
      <TableRow sx={{ pl: 0, mr: 0, border: "none" }}>
        <TableCell
          // className="global_table custom-scrollbar innertable"
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
                // sx={{ overflowX: "auto" }}
                // className="InnerTable table"
              >
                <TableHead>
                  <TableRow>
                    {InnerColumns.map((column) => (
                      <TableCell
                        // className="global_table"
                        key={column.id}
                        align="center"
                        // sx={{
                        //   bgcolor: "#565960",
                        //   color: "#fff",
                        //   minWidth: column.minWidth,
                        // }}
                      >
                        {column.label}
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
                            {item?.columnKey === "FillAllPercentage"
                              ? `${innerRow[item?.columnKey] ?? 0}%`
                              : innerRow[item?.columnKey] ?? 0}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        className="global_table"
                        style={{ textAlign: "center" }}
                        // colSpan={7}
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

export default FillAllRow;
