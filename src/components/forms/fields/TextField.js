import { FormControl, TextField as MuiTextField } from "@material-ui/core";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import styled from "styled-components/macro";
import { useRef, useState } from "react";

import InputErrorMessage from "../../common/InputErrorMessage";

const TextField = ({
  input,
  meta,
  label,
  value,
  error,
  type,
  onChange,
  onBlur,
  skipParseNumber,
  ...rest
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPasswordRef = useRef(type === "password");

  const isNumber = type === "number";

  return (
    <FormControl fullWidth variant="outlined" className="form-row form-input">
      <MuiTextField
        label={label}
        variant="outlined"
        value={value || ""}
        error={error && Boolean(error)}
        onChange={e => onChange && onChange(e.target?.value)}
        type={
          isNumber || !type
            ? undefined
            : isPasswordRef.current
            ? passwordVisible
              ? "text"
              : "password"
            : type
        }
        onBlur={e => {
          if (!skipParseNumber) {
            const nextValue = isNumber ? Number(e.target.value) : e.target.value;

            if ((isNumber && !isNaN(nextValue)) || !isNumber) {
              onChange && onChange(nextValue);
            }

            onBlur && onBlur(e);
          }
        }}
        {...input}
        {...rest}
      />
      {isPasswordRef.current && (
        <IconWrap onClick={() => setPasswordVisible(prevState => !prevState)}>
          {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconWrap>
      )}
      {error && <InputErrorMessage error={error} />}
    </FormControl>
  );
};

export default TextField;

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  right: ${({ theme }) => theme.spacing(2)}px;
  transform: translateY(-50%);
`;
