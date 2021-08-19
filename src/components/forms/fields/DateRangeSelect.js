import React, { useState, useRef } from "react";
import cn from "classnames";
import styled from "styled-components/macro";
import { format } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { DatePicker as DatePickerMUI, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { IconButton, Dialog, DialogActions, Button, MenuList, MenuItem } from "@material-ui/core";
import {
  addWeeks,
  addMonths,
  endOfWeek,
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  isSameDay,
  isBefore,
  isAfter,
} from "date-fns";

import useTranslate from "../../hooks/useTranslate";

const getDateRangeString = (start, end) => {
  return `${parseInt(Math.floor(startOfDay(start).getTime() / 1000))}-${parseInt(
    Math.floor(endOfDay(end).getTime() / 1000)
  )}`;
};

const createRangeOptions = () =>
  getDefaultRanges(new Date()).map(({ label, startDate, endDate }) => ({
    name: label,
    value: { startDate, endDate },
  }));

const getDefaultRanges = date => [
  {
    label: "Today",
    startDate: startOfDay(date),
    endDate: endOfDay(date),
  },

  {
    label: "This Week",
    startDate: startOfWeek(date),
    endDate: endOfWeek(date),
  },
  {
    label: "Last Week",
    startDate: startOfWeek(addWeeks(date, -1)),
    endDate: endOfWeek(addWeeks(date, -1)),
  },
  {
    label: "Last 7 Days",
    startDate: addWeeks(date, -1),
    endDate: endOfDay(date),
  },
  {
    label: "This Month",
    startDate: startOfMonth(date),
    endDate: endOfMonth(date),
  },
  {
    label: "Last Month",
    startDate: startOfMonth(addMonths(date, -1)),
    endDate: endOfMonth(addMonths(date, -1)),
  },
];

const DateRangeSelect = ({ options, onChange, disabled, value, label, ...props }) => {
  const [rangeOptions, setRangeOptions] = useState(createRangeOptions());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [date, _setDate] = useState({ start: new Date(), end: new Date() });
  const dateRef = useRef(date);
  const currentSelector = useRef("start");
  const i18n = useTranslate();
  const setDate = data => {
    dateRef.current = data;
    _setDate(data);
  };

  const renderDay = (date, selectedDate, dayInCurrentMonth) => {
    const dayIsBetween = isWithinInterval(date, {
      start: dateRef.current.start,
      end: dateRef.current.end,
    });

    const isFirstDay = isSameDay(dateRef.current.start, date);
    const isLastDay = isSameDay(dateRef.current.end, date);

    const dayClassName = cn("MuiPickersDay-day", {
      highlight: dayIsBetween && !isLastDay,
      firstHighlight: isFirstDay,
      endHighlight: isLastDay,
      "MuiPickersDay-hidden": !dayInCurrentMonth,
    });

    return (
      <IconButton className={dayClassName}>
        <span>
          <p>{format(date, "d")}</p>
        </span>
      </IconButton>
    );
  };

  return (
    <>
      <Button
        disabled={disabled}
        label={label}
        onClick={() => setPickerOpen(true)}
        disableRipple
        disableFocusRipple
        size="small"
      >
        <span className="buttonText">
          {value
            ? `${format(dateRef.current.start, "MM/dd")} - ${format(dateRef.current.end, "MM/dd")}`
            : ""}
        </span>
        <DateRangeIcon fontSize="small" color="primary" />
      </Button>

      <StyledDialog
        open={pickerOpen}
        onBackdropClick={() => setPickerOpen(false)}
        onEnter={() => setRangeOptions(createRangeOptions())}
      >
        <ToolbarWrapper>
          <span className={cn("dateLabel", { active: currentSelector.current === "start" })}>
            {format(dateRef.current.start, "EEE, MMM dd")}
          </span>
          <span>{"-"}</span>
          <span className={cn("dateLabel", { active: currentSelector.current === "end" })}>
            {format(dateRef.current.end, "EEE, MMM dd")}
          </span>
        </ToolbarWrapper>
        <PickerWrap>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePickerMUI
              value={new Date(dateRef.current.end)}
              disableToolbar
              variant="static"
              renderDay={renderDay}
              onChange={selectedDate => {
                if (currentSelector.current === "start") {
                  if (isAfter(selectedDate, dateRef.current.end)) {
                    setDate({ start: selectedDate, end: selectedDate });
                  } else {
                    setDate({ start: selectedDate, end: dateRef.current.end });
                  }
                  currentSelector.current = "end";
                } else if (currentSelector.current === "end") {
                  if (isBefore(selectedDate, dateRef.current.start)) {
                    setDate({ start: selectedDate, end: dateRef.current.end });
                  } else {
                    setDate({ start: dateRef.current.start, end: selectedDate });
                  }
                  currentSelector.current = "start";
                }
              }}
            />
          </MuiPickersUtilsProvider>
          <MenuList>
            {[{ name: i18n("ALL"), value: "" }, ...rangeOptions].map(opt => (
              <MenuItem
                value={opt.value}
                key={opt.value + opt.name}
                onClick={() => {
                  if (opt.value === "") {
                    onChange(opt.value);
                    setPickerOpen(false);
                  } else {
                    setDate({ start: opt.value.startDate, end: opt.value.endDate });
                  }
                }}
              >
                {opt.name}
              </MenuItem>
            ))}
          </MenuList>
        </PickerWrap>

        <DialogActions>
          <Button
            onClick={() => {
              setPickerOpen(false);
              onChange(getDateRangeString(dateRef.current.start, dateRef.current.end));
            }}
            color="primary"
          >
            {i18n("OK")}
          </Button>
          <Button
            onClick={() => {
              onChange("");
              setPickerOpen(false);
            }}
            color="primary"
          >
            {i18n("RESET")}
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default DateRangeSelect;

const PickerWrap = styled.div`
  display: flex;
`;
const StyledDialog = styled(Dialog)`
  &.MuiDialog-root {
    .MuiTypography-caption {
      font-size: 15px;
    }

    .MuiPickersCalendar-week {
      margin: 2px 0;
    }

    .MuiPickersDay-day {
      color: ${({ theme }) => theme.palette.text.primary};
      width: 36px;
      height: 36px;
      margin: 0;
      padding: 0;
      font-size: 0.875rem;
      font-family: "Roboto", "Helvetica", "Arial", sans-serif;
      font-weight: 400;
      line-height: 1.43;
      letter-spacing: 0.01071em;

      p {
        margin: 0;
      }

      &.MuiPickersDay-hidden {
        opacity: 0;
        pointer-events: none;
      }

      &.highlight {
        background: ${({ theme }) => theme.palette.success.light};
        color: ${({ theme }) => theme.palette.primary.contrastText};
        border-radius: 0;
      }

      &.firstHighlight,
      &.endHighlight {
        background: ${({ theme }) => theme.palette.success.main};
        color: ${({ theme }) => theme.palette.primary.contrastText};
        border-radius: 50%;
      }

      &.firstHighlight {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        &.endHighlight {
          border-radius: 50%;
        }
      }

      &.endHighlight {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
`;

const ToolbarWrapper = styled.div`
  padding: 18px 15px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};

  .MuiTypography-root {
    margin-bottom: ${({ theme }) => `${theme.spacing(4)}px`};
  }

  & > span {
    color: ${({ theme }) => theme.palette.primary.contrastText};
    font-size: 24px;
    font-weight: 400;
    margin: 0 5px;

    &.dateLabel {
      color: ${({ theme }) => theme.palette.secondary.contrastText};
    }

    &.active {
      color: ${({ theme }) => theme.palette.primary.contrastText};
    }
  }
`;
