import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function CommonForm(props) {
  const {
    handleSubmit,
    options,
    handleAutocompleteChange,
    handleAutocompleteClick,
    error,
    popupOpen,
    setPopupOpen,
    handleClose,
    getOptionLabel,
    key,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Autocomplete
        fullWidth
        disablePortal
        id="combo-box-demo"
        options={options}
        sx={{ margin: "10px 0", padding: 0 }}
        getOptionLabel={getOptionLabel} // Use getOptionLabel prop
        // getOptionLabel={(option) => option.category_name}
        key={key}
        onChange={handleAutocompleteChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              params.inputProps.value
                ? params.inputProps.value.label
                : "Content Category"
            }
            error={error.contentCategory}
            helperText={
              error.contentCategory && "Please enter the content Category"
            }
          />
        )}
        onFocus={handleAutocompleteClick}
      />

      <div style={{ textAlign: "center" }}>
        <Button
          size="large"
          variant="contained"
          style={{ background: "#C62828", marginRight: "10px" }}
          onClick={handleClose}
        >
          Close
        </Button>
        <Button
          size="large"
          type="submit"
          variant="contained"
          style={{ background: "#1d213e", marginRight: "15px" }}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

export default CommonForm;
