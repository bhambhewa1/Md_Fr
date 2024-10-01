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
import UserAnalyticsRow from "./UserAnalyticsRow";

const UserAnalyticsTable = ({ columns, InnerColumns, MainDataArray, serial }) => {
  return (
    <>
      <TableContainer
        className="custom-scrollbar"
        component={Paper}
        sx={{ overflowX: "auto" }}
        // sx={{ overflowY: "auto" }}
      >
        <Table stickyHeader aria-label="collapsible table" className="userAn1" >
          <TableHead className="userAn_Head">
            <TableRow className="custom-scrollbar">
              <TableCell align="center" sx={{ bgcolor: "#40434E", color: "#fff", textAlign: "center" }}
              >Sr No.</TableCell>
              {columns.map((column) => (
                <TableCell sx={{ bgcolor: "#40434E", color: "#fff", textAlign: "center" }}
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
                const { ApprovedData, ...newObject } = rowData;
                return (
                  <UserAnalyticsRow
                    key={index}
                    outerObject={newObject}
                    defaultArray={ApprovedData}
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
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UserAnalyticsTable;
