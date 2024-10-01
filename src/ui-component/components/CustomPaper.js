import React from 'react'
import { Paper } from '@mui/material';

const CustomPaper = (props) => (
    <Paper
      {...props}
      style={{
        boxShadow:
          "0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)",
      }}
    />
  );

export default CustomPaper
