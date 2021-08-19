import React from "react";
import { Field } from "react-final-form";
import { Chip } from "@material-ui/core";

import Autocomplete from "../fields/Autocomplete";

const VirtualizedAutoComplete = ({ name, options, ...rest }) => {
  return (
    <Field name={name} type="select">
      {({ input, meta }) => {
        const { onChange, value, ...inputProps } = input;

        return (
          <Autocomplete
            className="autocomplete-wrap"
            options={options}
            value={value}
            onChange={(e, selectedOption) => onChange(selectedOption)}
            getOptionDisabled={option => option.disabled}
            getOptionSelected={(option, selectedOption) => option?.value === selectedOption?.value}
            getOptionLabel={option => option.name}
            renderTags={(values, getTagProps) => {
              return values.map(value => {
                const currentSelection = options.find(option => option.value === value);
                const props = getTagProps(currentSelection.value);

                return (
                  <Chip label={currentSelection.name} {...props} key={currentSelection.value} />
                );
              });
            }}
            optionsContainerWidth={500}
            openOnFocus
            {...inputProps}
            {...rest}
          />
        );
      }}
    </Field>
  );
};

export default VirtualizedAutoComplete;
