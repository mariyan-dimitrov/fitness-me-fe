import React from "react";
import { format } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { IconButton, InputAdornment } from "@material-ui/core";
import { DatePicker as DatePickerMUI, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Clear as ClearIcon, InsertInvitation as CalendarIcon } from "@material-ui/icons";

const DatePicker = ({ dateFormat, onChange, clearable, value, ...rest }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePickerMUI
        {...rest}
        value={value || new Date()}
        clearable={clearable}
        format={dateFormat}
        onChange={selectedDate => onChange(format(selectedDate, dateFormat))}
        InputProps={
          clearable === "true" && {
            endAdornment: value ? (
              <InputAdornment position="end">
                <IconButton onClick={() => onChange(null)}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : (
              <InputAdornment position="end">
                <IconButton>
                  <CalendarIcon />
                </IconButton>
              </InputAdornment>
            ),
          }
        }
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePicker;
