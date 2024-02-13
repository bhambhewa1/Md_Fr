import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { Box, Modal } from "@mui/material";

const Popup = ({ open, onClose, title, content, actions, overflowY, height,outerBoxClass, titleClass, contentClass, actionsClass }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    maxWidth: 600,
    borderRadius: 4,
    boxShadow: 24,
    // p: 2,
    overflowY: overflowY,
    height: height
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={outerBoxClass} sx={style}>
        {title && (
          <Typography
            id="modal-modal-title"
            variant="h3" // Adjusted variant to 'h4' for proper styling
            component="div"
            className={titleClass}
            sx={{ marginBottom: 2 }} // Added margin to the title
          >
            {title}
          </Typography>
        )}
        <DialogContent className={contentClass} style={{padding:0}}>{content}</DialogContent>
        {actions && <DialogActions className={actionsClass}>{actions}</DialogActions>}
      </Box>
    </Modal>
  );
};

export default Popup;
