import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'; // Import dayjs

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const BasicDateCalendar = ({ valueFrom, valueTo, onChangeFrom, onChangeTo, onClear, onDone }) => {
  const today = dayjs()

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" flexDirection="column">
        <Box display="flex" justifyContent="space-between">
          <DateCalendar value={valueFrom} onChange={onChangeFrom} maxDate={today}/>
          <DateCalendar value={valueTo} onChange={onChangeTo} sx={{marginLeft:"90px"}} maxDate={today}/>
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <DatePicker
            label="From"
            value={valueFrom}
            maxDate={today}
            onChange={(newValue) => onChangeFrom(newValue)}
            sx={{ marginLeft:"24px", width: "270px"  }}
          />
          <DatePicker
            label="To"
            value={valueTo}
            maxDate={today}
            onChange={(newValue) => onChangeTo(newValue)}
            sx={{ marginRight:"24px", width: "270px"  }}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button onClick={onClear} variant="contained" color="secondary" style={{ marginRight: 8, color: 'white', background: "#40434E" }}>
            Clear
          </Button>
          <Button onClick={onDone} variant="contained" color="primary" style={{ marginRight: 8, color: '#fff', backgroundColor: '#E11927' }}>
            Done
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default BasicDateCalendar;
