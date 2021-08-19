import React from "react";
import { Field } from "react-final-form";
import styled from "styled-components/macro";
import MuiSwitch from "@material-ui/core/Switch";

const Switch = ({ name, label, className, handleChange, ...rest }) => (
  <SwitchWrapper>
    {label && <label className="label-wrap">{label}</label>}
    <Field
      name={name}
      className={className}
      type="checkbox"
      component={({ input }) => {
        const { onFocus, onChange, checked, ...restInput } = input;
        return (
          <MuiSwitch
            checked={checked}
            onChange={e => {
              handleChange && handleChange(e);
              onChange(e);
            }}
            {...{ ...rest, ...restInput }}
          />
        );
      }}
    />
  </SwitchWrapper>
);

export default Switch;

const SwitchWrapper = styled.span`
  display: flex;
  flex-direction: column;
`;
