import styled from "styled-components/macro";

const InputErrorMessage = ({ error }) => {
  return error ? <ErrorMessage>{error}</ErrorMessage> : null;
};

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme?.palette?.error?.dark}};
`;

export default InputErrorMessage;
