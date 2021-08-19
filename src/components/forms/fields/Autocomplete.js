import { TextField, FormControl, Checkbox } from "@material-ui/core";
import MuiAutocomplete from "@material-ui/lab/Autocomplete";
import React, { forwardRef, cloneElement } from "react";
import { List } from "react-virtualized";
import styled from "styled-components";
import cn from "classnames";

import InputErrorMessage from "../../common/InputErrorMessage";

const Autocomplete = ({
  error,
  value,
  label,
  options,
  multiple,
  fullWidth,
  inputParams,
  placeholder,
  overscanCount = 5,
  optionWidth = 300,
  optionHeight = 35,
  optionsContainerWidth = 300,
  optionsContainerHeight = 250,
  optionKey = "name",
  ...rest
}) => {
  const ListboxComponent = forwardRef(({ children, role, ...props }, ref) => {
    return (
      <div ref={ref}>
        <div {...props}>
          <List
            height={optionsContainerHeight}
            width={optionsContainerWidth}
            rowHeight={optionHeight}
            rowWidth={optionWidth}
            overscanCount={overscanCount}
            rowCount={Array.isArray(children) ? children.length : 0}
            rowRenderer={({ index, style, isScrolling }) => {
              return cloneElement(children[index], {
                style: style,
              });
            }}
            role={role}
          />
        </div>
      </div>
    );
  });

  return (
    <StyledFormControl
      fullWidth={fullWidth}
      variant="outlined"
      className={cn("bo-form-row bo-form-input", {
        "is-multiple": multiple,
        "has-selected-items": Array.isArray(value) ? value.length > 0 : value,
      })}
    >
      <StyledMuiAutocomplete
        options={options || []}
        getOptionLabel={option => option[optionKey]}
        value={value || (multiple ? [] : null)}
        renderInput={inputParams => (
          <TextField
            {...inputParams}
            className="bo-form-input"
            error={error && Boolean(error)}
            label={label}
            variant="outlined"
            placeholder={placeholder}
          />
        )}
        ListboxComponent={ListboxComponent}
        renderOption={(option, { selected }) => {
          if (multiple) {
            return (
              <Option>
                <Checkbox checked={selected} color="primary" />
                {option[optionKey]}
              </Option>
            );
          }
          return option[optionKey];
        }}
        fullWidth={fullWidth}
        disableCloseOnSelect={Boolean(multiple)}
        multiple={multiple}
        {...rest}
      />
      {error && <InputErrorMessage error={error} />}
    </StyledFormControl>
  );
};
export default Autocomplete;

const StyledMuiAutocomplete = styled(MuiAutocomplete)`
  z-index: 1;
`;

const Option = styled.div`
  width: 100%;
  overflow: hidden;
`;

const StyledFormControl = styled(FormControl)`
  &.is-multiple.has-selected-items {
    &::after {
      display: block;
      content: "";
      width: 100%;
      height: 1px;
      position: absolute;
      left: 0;
      bottom: 49px;
      background: ${({ theme }) => theme.palette.divider};
    }

    .MuiAutocomplete-endAdornment {
      top: auto;
      bottom: 14px;
    }

    .bo-form-input {
      .MuiInputBase-input {
        width: 100%;
        margin-top: 13px;
      }
    }
  }
`;
