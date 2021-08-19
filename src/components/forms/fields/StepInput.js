import React, { useState, useEffect, useLayoutEffect, useCallback, useRef, memo } from "react";
import styled from "styled-components/macro";
import {
  Tooltip,
  InputAdornment,
  OutlinedInput,
  FormControl,
  InputLabel,
  Button,
} from "@material-ui/core";
import { Remove as RemoveIcon, Add as AddIcon } from "@material-ui/icons";

import detectMouseButtonType from "../../../utils/detectMouseButtonType";
import useEventListener from "../../hooks/useEventListener";
import useTooltipStyles from "../../hooks/useTooltipStyles";
import { toFixed } from "../../../utils/tradingMath";

const autoUpdateValueIntervals = [600, 300, 150, 50];

const StepInputWrapper = ({ onChange, onFocus, onBlur, ...rest }) => {
  const memoized = useRef({
    onChange: val => (onChange ? onChange(val) : false),
    onFocus: val => (onFocus ? onFocus(val) : false),
    onBlur: val => (onBlur ? onBlur(val) : false),
  });

  return (
    <StepInput
      {...rest}
      onChange={memoized.current.onChange}
      onFocus={memoized.current.onFocus}
      onBlur={memoized.current.onBlur}
    />
  );
};

const StepInput = memo(
  ({
    id,
    label,
    value = 0,
    min = 0,
    max = 1000000,
    step = 1,
    precision = false,
    allowFloat,
    currency,
    disabled,
    onChange,
    onFocus,
    onBlur,
    error,
    autoValidate,
  }) => {
    const { tooltipRed } = useTooltipStyles();
    const [tooltipShown, setTooltipShown] = useState(false);
    const valueChangeFrequency = useRef(autoUpdateValueIntervals[0]);
    const inputWidthHolderRef = useRef();
    const hideTooltipTimeout = useRef();
    const changeValueTimeout = useRef();
    const valueChangedCount = useRef(0);
    const isMouseDownRef = useRef(false);

    const onInputBlur = e => {
      let val = parseFloat(e.target.value) || Number(value);

      onBlur(e);

      if (val < min) {
        val = min;
        showTooltip("min");
      } else if (val > max) {
        val = max;
        showTooltip("max");
      }

      if (step % 1 === 0 && val % 1 !== 0 && !allowFloat) {
        val = toFixed(val);
      }

      onChange(val ? toFixed(val, precision) : val);
    };

    const onInputChange = e => {
      let val = e.target.value.replace(/,/g, "");

      const regex = new RegExp("^[+-]?[0-9]*.?[0-9]{0," + precision + "}$");

      if (precision && !val.match(regex)) {
        val = value;
      }

      val > max && showTooltip("max");
      !disabled && val <= max && onChange(val);
    };

    const decrement = useCallback(() => {
      let val = Number(value) - Number(step);

      if (precision !== false) {
        val = toFixed(val, precision);
      }

      !disabled && val >= min && onChange(val);
    }, [min, step, value, disabled, onChange, precision]);

    const increment = useCallback(() => {
      let val = Number(value) + Number(step);

      if (precision !== false) {
        val = toFixed(val, precision);
      }

      !disabled && val <= max && onChange(val);
    }, [max, step, value, disabled, onChange, precision]);

    const hideTooltip = () => {
      clearTimeout(hideTooltipTimeout.current);
      setTooltipShown(false);
    };

    const showTooltip = useCallback(
      type => {
        clearTimeout(hideTooltipTimeout.current);

        if (type === "min") {
          setTooltipShown(`Input minimum value: ${min}`);
        } else if (type === "max") {
          setTooltipShown(`Input maximum value: ${max}`);
        }

        hideTooltipTimeout.current = setTimeout(() => {
          setTooltipShown(false);
        }, 3000);
      },
      [max, min]
    );

    const resetAutoChangeValues = () => {
      valueChangeFrequency.current = autoUpdateValueIntervals[0];
      valueChangedCount.current = 0;
      isMouseDownRef.current = false;
      clearTimeout(changeValueTimeout.current);
    };

    const minusButtonColor = value <= min || disabled ? "default" : "primary";
    const plusButtonColor = value >= max || disabled ? "default" : "primary";
    const minusIconColor = value <= min || disabled ? "disabled" : "primary";
    const plusIconColor = value >= max || disabled ? "disabled" : "primary";

    useEventListener("mouseup", () => {
      isMouseDownRef.current && resetAutoChangeValues();
    });

    useEffect(() => {
      return () => clearTimeout(hideTooltipTimeout.current);
    }, []);

    useLayoutEffect(() => {
      if (isMouseDownRef.current) {
        if (valueChangedCount.current >= 7) {
          valueChangeFrequency.current = autoUpdateValueIntervals[3];
        } else if (valueChangedCount.current >= 4) {
          valueChangeFrequency.current = autoUpdateValueIntervals[2];
        } else if (valueChangedCount.current > 1) {
          valueChangeFrequency.current = autoUpdateValueIntervals[1];
        }

        changeValueTimeout.current = setTimeout(() => {
          valueChangedCount.current += 1;

          isMouseDownRef.current === "INCREMENT" ? increment() : decrement();
        }, valueChangeFrequency.current);
      } else {
        clearTimeout(changeValueTimeout.current);
      }
    }, [value, decrement, increment]);

    useEffect(() => {
      if (autoValidate) {
        const val = Number(value);

        if (val < min) {
          showTooltip("min");
        } else if (val > max) {
          showTooltip("max");
        }
      }
    }, [value, autoValidate, min, max, showTooltip]);

    return (
      <Wrap>
        <BtnWrap
          onMouseDown={e => {
            if (detectMouseButtonType(e) === "LEFT") {
              isMouseDownRef.current = "DECREMENT";
              valueChangedCount.current = 1;
              decrement();
            }
          }}
        >
          <Button
            variant="outlined"
            color={minusButtonColor}
            disabled={minusButtonColor === "default" || disabled}
          >
            <RemoveIcon color={minusIconColor} />
          </Button>
        </BtnWrap>

        <InputWrap>
          <FormControl fullWidth variant="outlined">
            {!disabled && (
              <Tooltip
                className="quantity-stepper"
                classes={tooltipRed}
                placement="top"
                title={tooltipShown}
                open={Boolean(tooltipShown)}
                onClick={hideTooltip}
                arrow
              >
                <span />
              </Tooltip>
            )}

            {label && (
              <InputLabel error={Boolean(error)} htmlFor={id}>
                {label}
              </InputLabel>
            )}
            <OutlinedInput
              id={id}
              value={value}
              label={label}
              error={Boolean(error)}
              disabled={disabled}
              onChange={onInputChange}
              onFocus={onFocus}
              onBlur={onInputBlur}
              endAdornment={currency && <InputAdornment position="end">{currency}</InputAdornment>}
            />
          </FormControl>
          <InputWidthHolder ref={inputWidthHolderRef}>{value}</InputWidthHolder>
        </InputWrap>
        <BtnWrap
          onMouseDown={e => {
            if (detectMouseButtonType(e) === "LEFT") {
              isMouseDownRef.current = "INCREMENT";
              valueChangedCount.current = 1;
              increment();
            }
          }}
        >
          <Button
            variant="outlined"
            color={plusButtonColor}
            disabled={plusButtonColor === "default" || disabled}
          >
            <AddIcon color={plusIconColor} />
          </Button>
        </BtnWrap>
      </Wrap>
    );
  }
);

export default StepInputWrapper;

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  margin-bottom: 4px;
  width: 100%;
`;

const BtnWrap = styled.div`
  .MuiButtonBase-root {
    height: 100%;
  }
`;

const InputWrap = styled.label`
  font-size: 24px;
  cursor: text;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-weight: bold;
  padding: 0;
  margin: 0 ${({ theme }) => theme.spacing(2)}px;

  input {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }

  .MuiOutlinedInput-root {
    max-height: ${({ theme }) => theme.spacing(7)}px;
  }

  .quantity-stepper {
    osition: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
`;

const InputWidthHolder = styled.div`
  display: block;
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  padding: 0;
  margin: 0;
  top: -99999px;
  left: -99999px;
`;
