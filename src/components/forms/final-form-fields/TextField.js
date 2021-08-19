import React from "react";
import cn from "classnames";
import { Field } from "react-final-form";

import CustomTextField from "../fields/TextField";

const TextField = ({ name, fullWidth, className, handleChange, ...rest }) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        const { onChange, ...restInput } = input;

        return (
          <CustomTextField
            {...restInput}
            {...rest}
            onChange={value => {
              onChange(value);
              handleChange && handleChange(value);
            }}
            className={cn("bo-input", className)}
            error={meta.touched && meta.error}
          />
        );
      }}
    </Field>
  );
};

export default TextField;
