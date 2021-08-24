import styled from "styled-components/macro";
import { Field } from "react-final-form";
import cn from "classnames";

import CustomTextField from "../fields/TextField";
import { useThemeContext } from "../../contexts/ThemeContext";

const DateTimePicker = ({ name, fullWidth, className, handleChange, ...rest }) => {
  const { theme } = useThemeContext();

  return (
    <Field name={name}>
      {({ input, meta }) => {
        const { onChange, ...restInput } = input;

        return (
          <StyledCustomTextField
            {...restInput}
            {...rest}
            type="datetime-local"
            onChange={value => {
              onChange(value);
              handleChange && handleChange(value);
            }}
            className={cn("bo-input", className, {
              "is-dark-theme": theme === "dark",
            })}
            error={meta.touched && meta.error}
          />
        );
      }}
    </Field>
  );
};

export default DateTimePicker;

const StyledCustomTextField = styled(CustomTextField)`
  &.is-dark-theme {
    input::-webkit-calendar-picker-indicator {
      filter: invert(1);
    }
  }
`;
