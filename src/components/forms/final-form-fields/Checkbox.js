import styled from "styled-components/macro";
import { Field } from "react-final-form";

import CustomCheckbox from "../fields/Checkbox";

const Checkbox = ({ name, className, handleChange, ...rest }) => (
  <CheckboxWrapper>
    <Field
      name={name}
      className={className}
      type="checkbox"
      component={({ input }) => {
        const { onFocus, onChange, ...restInput } = input;

        return (
          <CustomCheckbox
            {...restInput}
            {...rest}
            onChange={e => {
              onChange(e);
              handleChange && handleChange();
            }}
          />
        );
      }}
    />
  </CheckboxWrapper>
);

export default Checkbox;

const CheckboxWrapper = styled.span`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;

  &.reversed {
    flex-direction: row-reverse;
    justify-content: flex-end;
  }
`;
