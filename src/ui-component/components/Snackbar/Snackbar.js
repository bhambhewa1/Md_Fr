import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function Message({ snackbar, handleCloseSnackbar }) {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            open={snackbar.open}
            onClose={handleCloseSnackbar}
            autoHideDuration={4000} // Optional, will automatically close after 3 seconds
        >
            <Alert
                elevation={6}
                variant="filled"
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    );
}

export default Message;
