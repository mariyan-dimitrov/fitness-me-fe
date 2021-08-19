import React from "react";
import { FormControl, InputLabel, OutlinedInput as MuiTextField } from "@material-ui/core";

import InputErrorMessage from "../../common/InputErrorMessage";

const TextField = ({
  input,
  meta,
  label,
  value,
  error,
  type,
  onChange,
  onBlur,
  skipParseNumber,
  ...rest
}) => {
  const isNumber = type === "number";

  return (
    <FormControl fullWidth variant="outlined" className="bo-form-row bo-form-input">
      <InputLabel>{label}</InputLabel>
      <MuiTextField
        label={label}
        variant="outlined"
        value={value || ""}
        error={error && Boolean(error)}
        onChange={e => onChange && onChange(e.target?.value)}
        type={isNumber || !type ? undefined : type}
        onBlur={e => {
          if (!skipParseNumber) {
            const nextValue = isNumber ? Number(e.target.value) : e.target.value;

            if ((isNumber && !isNaN(nextValue)) || !isNumber) {
              onChange && onChange(nextValue);
            }

            onBlur && onBlur(e);
          }
        }}
        {...input}
        {...rest}
      />
      {error && <InputErrorMessage error={error} />}
    </FormControl>
  );
};

export default TextField;
