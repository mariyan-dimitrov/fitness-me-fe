import styled from "styled-components/macro";
import { Field } from "react-final-form";
import format from "date-fns/format";
import cn from "classnames";

import { useThemeContext } from "../../contexts/ThemeContext";
import CustomTextField from "../fields/TextField";

const DateTimePicker = ({ name, fullWidth, className, handleChange, ...rest }) => {
  const { theme } = useThemeContext();

  return (
    <Field name={name}>
      {({ input, meta }) => {
        const { onChange, value, ...restInput } = input;
        const safeValue =
          typeof value === "object"
            ? format(new Date(value), "yyyy-MM-dd'T'k:mm")
            : value.includes(".")
            ? value.split(".")[0]
            : value;

        return (
          <StyledCustomTextField
            {...restInput}
            {...rest}
            value={safeValue}
            inputProps={{
              max: format(new Date(), "yyyy-MM-dd'T'k:mm"),
            }}
            type="datetime-local"
            onChange={value => {
              onChange(value);
              handleChange && handleChange(value);
            }}
            className={cn("input", className, {
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
