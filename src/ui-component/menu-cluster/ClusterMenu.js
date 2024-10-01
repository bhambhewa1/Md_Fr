import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ITEM_HEIGHT = 48;

const LongMenu = ({ anchorEl, handleClose, Items }) => {
  const open = Boolean(anchorEl);

  return (
    <div>
      {/* <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton> */}
      <Menu
        // id="long-menu"
        // MenuListProps={{
        //   'aria-labelledby': 'long-button',
        // }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            // width: "20ch",
          },
        }}
      >
        {Items.map((Item, index) => (
          <MenuItem key={index} disabled={Item.isDisable} onClick={Item.onClick}>
            {Item.text}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default LongMenu;
