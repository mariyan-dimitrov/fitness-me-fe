import React from "react";
import { Radio as RadioButton, FormControlLabel } from "@material-ui/core";

const Radio = ({ value, label, labelPlacement, ...rest }) => (
  <FormControlLabel
    value={value}
    label={label}
    labelPlacement={labelPlacement}
    control={<RadioButton {...rest} />}
  />
);

export default Radio;
