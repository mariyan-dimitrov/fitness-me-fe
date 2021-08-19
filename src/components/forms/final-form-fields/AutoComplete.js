import React from "react";
import styled from "styled-components/macro";
import cn from "classnames";
import { Field } from "react-final-form";
import { Autocomplete } from "@material-ui/lab";
import { TextField, FormControl } from "@material-ui/core";

import InputErrorMessage from "../../common/InputErrorMessage";

const AutoComplete = ({
  name,
  type,
  icon,
  label,
  options,
  className,
  handleChange,
  mainItemProp = "value",
  ...rest
}) => {
  const getSelectedItem = value => {
    if (typeof value === "object") {
      return value;
    }
    return (options && options.find(option => option[mainItemProp] === value)) || null;
  };

  return (
    <AutoCompleteWrapper className={cn("bo-form-row", "bo-form-input", className)}>
      <Field name={name} type="select">
        {({ input, meta }) => {
          const { onChange, value, ...inputProps } = input;

          return (
            <FormControl>
              <Autocomplete
                {...rest}
                value={getSelectedItem(value) || null}
                options={options || []}
                className={cn({ "error-state": meta.touched && meta.error })}
                getOptionLabel={option => option.name}
                onChange={(event, selectedItem) => {
                  const isNumber = type === "number";
                  let nextValue = isNumber
                    ? Number(selectedItem?.[mainItemProp])
                    : selectedItem?.[mainItemProp];

                  if ((isNumber && isNaN(nextValue)) || nextValue === undefined) {
                    nextValue = null;
                  }

                  onChange(nextValue);
                  handleChange && handleChange(nextValue);
                }}
                renderInput={params => (
                  <>
                    <TextField
                      {...inputProps}
                      {...params}
                      label={label}
                      variant="outlined"
                      error={meta.touched && Boolean(meta.error)}
                    />
                    <InputErrorMessage error={meta.touched && meta.error} />
                  </>
                )}
              />
            </FormControl>
          );
        }}
      </Field>
    </AutoCompleteWrapper>
  );
};

export default AutoComplete;

const AutoCompleteWrapper = styled.span`
  display: flex;
  align-items: center;

  .MuiFormControl-root {
    width: 100%;
  }
`;
