import { Checkbox as MuiCheckbox, FormControlLabel } from "@material-ui/core";

const Checkbox = ({ label, labelPlacement, ...rest }) => (
  <FormControlLabel
    labelPlacement={labelPlacement}
    label={label}
    control={<MuiCheckbox {...rest} />}
  />
);

export default Checkbox;
