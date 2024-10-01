import React from "react";
import {
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import './CommonTable_style.css'

const CommonTable = ({ columns, MainDataArray, serial }) => {
  const serialNumber = (index) => {
    return serial + index + 1;
  };

  return (
    <>
      <TableContainer
        className="custom-scrollbar"
        component={Paper}
        // sx={{ overflowX: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow className="custom-scrollbar">
              <TableCell
                align="center"
                className="commonTableHeader"
              >
                Sr No.
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  className="commonTableHeader"
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {MainDataArray && MainDataArray.length > 0 ? (
              MainDataArray
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((rowData, index) => {
                  return (
                    <TableRow className="custom-scrollbar" key={index} sx={{borderBottom: "1px solid #e0e3e8",background: index%2 !== 0 ? "#F1F4F9" : ""}}>
                      <TableCell align="center" className="commonTableCell">{serialNumber(index)}</TableCell>
                      {columns &&
                        columns.slice(0, columns.length).map((column) => (
                          <TableCell key={column.id} align="center" className="commonTableCell">
                            {rowData[column.columnKey]}
                          </TableCell>
                        ))}
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "none !important" }} 
                  colSpan={columns.length + 1}
                >No Record Found
                  {/* {company
                    ? "No Record Found"
                    : "Please select a company first."} */}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CommonTable;
