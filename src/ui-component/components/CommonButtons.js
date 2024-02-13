import React from "react";
import { Button } from "@mui/material";

function CommonButton({
  onMClick,
  onAIClick,
  isAIDisabled,
  AIbackground,
  ManualBackground,
  isManualDisabled
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <Button
        style={{
          background: ManualBackground ,
          margin: 0,
          minWidth: "32px",
          padding: "10px",
          marginRight: "10px",
          color:"#fff"
        }}
       disabled={isManualDisabled}
        size="small"
        variant="contained"
        onClick={onMClick}
      >
        M
      </Button>
      <Button
        style={{
          background: AIbackground ,
          margin: 0,
          minWidth: "32px",
          padding: "10px",
          color: "#fff",
        }}
        size="small"
        variant="contained"
        onClick={onAIClick}
        disabled={isAIDisabled}
      >
        AI
      </Button>
    </div>
  );
}

export default CommonButton;
