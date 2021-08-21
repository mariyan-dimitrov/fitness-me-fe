import styled from "styled-components";
import { Field } from "react-final-form";
import DateTimeRangeSelectCustom from "../fields/DateTimeRangeSelect";

const DateTimeRangeSelect = ({ name, ...rest }) => {
  return (
    <Field name={name} type="select">
      {({ input, meta }) => {
        return (
          <InputWrap>
            <DateTimeRangeSelectCustom {...rest} {...input} />
          </InputWrap>
        );
      }}
    </Field>
  );
};

export default DateTimeRangeSelect;

const InputWrap = styled.div`
  position: relative;
  width: 500px;
  margin-top: ${({ theme }) => theme.spacing(4)}px;

  .MuiFormControl-root.MuiFormControl-root {
    margin-bottom: 0;
  }

  .autocomplete-wrap {
    width: 500px;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-width: 1px;
  }

  .MuiButtonBase-root.MuiButton-text {
    width: 100%;
    font-size: 14px;
    padding: 18px 10px;
    min-width: 120px;
    min-height: 1.1876em;
    font-weight: 400;
    border: 1px solid ${({ theme }) => theme.palette.action.disabled};
    background: ${({ theme }) => theme.palette.background.paper};
    text-transform: none;

    .MuiButton-label {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .buttonText {
        margin-right: auto;
      }
    }
  }
`;
