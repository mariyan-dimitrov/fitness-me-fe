import React from "react";
import { Switch as MuiSwitch, FormControlLabel } from "@material-ui/core";

const Switch = ({ label, labelPlacement, checked, onChange, ...rest }) => (
  <FormControlLabel
    labelPlacement={labelPlacement}
    label={label}
    control={
      <MuiSwitch
        {...rest}
        checked={checked || false}
        onChange={e => {
          onChange && onChange(e.target?.checked || false);
        }}
      />
    }
  />
);

export default Switch;
