import styled from "styled-components/macro";
import { Field } from "react-final-form";

import CustomRadio from "../fields/Radio";

const Radio = ({ name, className, handleChange, ...rest }) => (
  <RadioWrapper>
    <Field
      name={name}
      className={className}
      type="radio"
      component={({ input }) => {
        const { onFocus, onChange, ...restInput } = input;

        return (
          <CustomRadio
            {...{ ...rest, ...restInput }}
            onChange={e => {
              onChange(e);
              handleChange && handleChange();
            }}
          />
        );
      }}
    />
  </RadioWrapper>
);

export default Radio;

const RadioWrapper = styled.span`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;

  &.reversed {
    flex-direction: row-reverse;
    justify-content: flex-end;
  }
`;
