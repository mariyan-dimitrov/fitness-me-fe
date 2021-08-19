import React from "react";

import { Select as MuiSelect, FormControl, MenuItem, InputLabel } from "@material-ui/core";

import InputErrorMessage from "../../common/InputErrorMessage";

const Select = ({ input, meta, options, value, label, ...rest }) => {
  return (
    <FormControl fullWidth className="bo-form-row bo-form-input" variant="outlined">
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        label={label}
        value={value || ""}
        {...input}
        {...rest}
        error={meta && meta.touched && Boolean(meta.error)}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          getContentAnchorEl: null,
        }}
      >
        {options.map(opt => (
          <MenuItem value={opt.value} key={opt.value}>
            {opt.name}
          </MenuItem>
        ))}
      </MuiSelect>
      <InputErrorMessage error={meta && meta.touched && meta.error} />
    </FormControl>
  );
};

export default Select;
