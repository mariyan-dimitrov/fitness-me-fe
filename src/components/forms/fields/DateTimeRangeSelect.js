import React, { useState, useRef } from "react";
import cn from "classnames";
import styled from "styled-components/macro";
import { format } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import DateRangeIcon from "@material-ui/icons/DateRange";
import {
  TimePicker,
  MuiPickersUtilsProvider,
  DatePicker as DatePickerMUI,
} from "@material-ui/pickers";
import { IconButton, Dialog, DialogActions, Button, MenuList, MenuItem } from "@material-ui/core";
import {
  isAfter,
  endOfDay,
  isBefore,
  addWeeks,
  addMonths,
  endOfWeek,
  isSameDay,
  startOfDay,
  endOfMonth,
  startOfWeek,
  startOfMonth,
  isWithinInterval,
} from "date-fns";

import useTranslate from "../../hooks/useTranslate";
import convertTime from "../../../utils/convertTime";

const localTimeOffsetMS = date => date.getTimezoneOffset() * 60 * 1000;

const getDateRangeString = (start, end) => {
  const startDateOffSet = localTimeOffsetMS(start);
  const endDateOffSet = localTimeOffsetMS(end);

  return `${parseInt(Math.floor((start.getTime() - startDateOffSet) / 1000))}-${parseInt(
    Math.floor((end.getTime() - endDateOffSet) / 1000)
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

const DateTimeRangeSelect = ({ options, onChange, disabled, value, limit, label, ...props }) => {
  const [date, _setDate] = useState({ start: new Date(), end: new Date() });
  const [rangeOptions, setRangeOptions] = useState(createRangeOptions());
  const [pickerOpen, setPickerOpen] = useState(false);
  const i18n = useTranslate();
  const currentSelector = useRef("start");
  const dateRef = useRef(date);

  const parsedLimit = limit ? convertTime(limit, "ms") : 0;

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

  const isInLimits = (dateA, dateB) =>
    parsedLimit ? Math.abs(dateA.getTime() - dateB.getTime()) <= parsedLimit : true;

  const handleFromDateChange = selectedDate => {
    if (
      isBefore(selectedDate, dateRef.current.end) &&
      isInLimits(selectedDate, dateRef.current.end)
    ) {
      setDate({ start: selectedDate, end: dateRef.current.end });
    } else {
      setDate({ start: selectedDate, end: selectedDate });
    }
  };

  const handleToDateChange = selectedDate => {
    if (
      isAfter(selectedDate, dateRef.current.start) &&
      isInLimits(selectedDate, dateRef.current.end)
    ) {
      setDate({ start: dateRef.current.start, end: selectedDate });
    } else {
      setDate({ start: selectedDate, end: selectedDate });
    }
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
          {value &&
            `${format(dateRef.current.start, "yyyy/MM/dd H:mm:ss")} - ${format(
              dateRef.current.end,
              "yyyy/MM/dd H:mm:ss"
            )}`}
        </span>
        <DateRangeIcon fontSize="small" color={disabled ? undefined : "primary"} />
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
            <PickersInnerWrap>
              <DatePickerMUI
                value={new Date(dateRef.current.end)}
                disableToolbar
                variant="static"
                renderDay={renderDay}
                onChange={selectedDate => {
                  if (currentSelector.current === "start") {
                    handleFromDateChange(selectedDate);
                    currentSelector.current = "end";
                  } else if (currentSelector.current === "end") {
                    handleToDateChange(selectedDate);
                    currentSelector.current = "start";
                  }
                }}
              />

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
            </PickersInnerWrap>
            <TimePickerOuterWrap>
              <TimePickersWrap>
                <TimePickerWrap>
                  <TimePicker
                    label={i18n("FORM_FIELDS.FROM")}
                    value={date.start}
                    onChange={handleFromDateChange}
                    ampm={false}
                    variant="inline"
                    format="HH:mm:ss"
                    inputVariant="outlined"
                    views={["hours", "minutes", "seconds"]}
                  />
                </TimePickerWrap>

                <TimePickerWrap>
                  <TimePicker
                    label={i18n("FORM_FIELDS.TO")}
                    value={date.end}
                    onChange={handleToDateChange}
                    ampm={false}
                    variant="inline"
                    format="HH:mm:ss"
                    inputVariant="outlined"
                    views={["hours", "minutes", "seconds"]}
                  />
                </TimePickerWrap>
              </TimePickersWrap>
              {Boolean(parsedLimit) && (
                <Limit>
                  {i18n(
                    parsedLimit === 1
                      ? "FORM_FIELDS.MAXIMUM_DATE_PERIOD_1_HOUR"
                      : "FORM_FIELDS.MAXIMUM_DATE_PERIOD_PLURAL",
                    {
                      limit: convertTime(`${parsedLimit}ms`, "h"),
                    }
                  )}
                </Limit>
              )}
            </TimePickerOuterWrap>
          </MuiPickersUtilsProvider>
        </PickerWrap>

        <DialogActions>
          <Button
            onClick={() => {
              if (isInLimits(date.start, date.end)) {
                setPickerOpen(false);
                onChange(getDateRangeString(dateRef.current.start, dateRef.current.end));
              }
            }}
            disabled={!isInLimits(date.start, date.end)}
            color="primary"
            variant="contained"
          >
            {i18n("OK")}
          </Button>
          <Button
            onClick={() => {
              onChange("");
              setPickerOpen(false);
            }}
            color="primary"
            variant="outlined"
          >
            {i18n("RESET")}
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default DateTimeRangeSelect;

const PickerWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const PickersInnerWrap = styled.div`
  display: flex;

  .MuiList-root {
    display: none;
  }

  .MuiPickersBasePicker-pickerView {
    min-height: 330px;
  }
`;

const TimePickerWrap = styled.div`
  &:first-child {
    margin-right: ${({ theme }) => `${theme.spacing(2)}px`};
  }
`;

const TimePickerOuterWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 320px;
`;

const TimePickersWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing(2)}px`};
`;

const Limit = styled.span`
  color: ${({ theme }) => theme.palette.text.secondary};
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
