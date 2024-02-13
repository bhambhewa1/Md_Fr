import { style, textAlign } from "@mui/system";
import React from "react";
import Loader, { Bars } from "react-loader-spinner";
import './style.css'

const Loading = ({ isLoading, height, width, color }) => {
  return (
    <div>
      {isLoading && (
        <div className="loading" style={{textAlign:"center"}}>
          <Bars
            height={height || 80}
            width={width || 80}
            color={color || "#5a49ae"}
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
    </div>
  );
};

export default Loading;
