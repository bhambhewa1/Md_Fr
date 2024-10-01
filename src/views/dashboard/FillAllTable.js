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
import "../../ui-component/components/CommonTable_style.css";
import FillAllRow from "./FillAllRow";

const FillAllTable = ({ columns, InnerColumns, MainDataArray, serial }) => {
  return (
    <>
      <TableContainer
        className="custom-scrollbar analytics"
        component={Paper}
        // sx={{ overflowX: "auto" }}
        sx={{ overflowY: "auto", maxHeight: 370 }}
      >
        <Table stickyHeader aria-label="collapsible table" className="userAn">
          <TableHead className="userAn_Head">
            <TableRow className="custom-scrollbar">
              <TableCell align="center">Sr No.</TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  // className="commonTableHeader"
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {MainDataArray && MainDataArray?.length > 0 ? (
              MainDataArray.map((rowData, index) => {
                const { batches, ...newObject } = rowData;
                return (
                  <FillAllRow
                    key={index}
                    outerObject={newObject}
                    // defaultArray={batches}
                    innerArray={batches}
                    columns={columns}
                    InnerColumns={InnerColumns}
                    Index={serial + index + 1}
                  />
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "none !important" }}
                  colSpan={columns.length + 1}
                >
                  No Record Found
                  {/* {company
                    ? "No Record Found"
                    : "Please select a company first."} */}
                </TableCell>
                {/* <TableCell
                  sx={{ textAlign: "center", borderLeft: "none !important" }}
                  colSpan={9}
                ></TableCell> */}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default FillAllTable;
