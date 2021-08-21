import { Field } from "react-final-form";
import { Select as MuiSelect, FormControl, MenuItem, InputLabel } from "@material-ui/core";

import InputErrorMessage from "../../common/InputErrorMessage";

const Select = ({ name, options, label, type, ...rest }) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        const { onChange, ...inputProps } = input;

        return (
          <FormControl fullWidth className="bo-form-row bo-form-input" variant="outlined">
            {label && <InputLabel>{label}</InputLabel>}
            <MuiSelect
              label={label}
              {...{ ...inputProps, ...rest }}
              error={meta && meta.touched && Boolean(meta.error)}
              onChange={e => {
                onChange(type === "number" ? Number(e.target.value) : e.target.value);
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
      }}
    </Field>
  );
};

export default Select;
