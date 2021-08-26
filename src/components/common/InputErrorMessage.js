import styled from "styled-components/macro";

const InputErrorMessage = ({ error }) => (error ? <ErrorMessage>{error}</ErrorMessage> : null);

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme?.palette?.error?.dark}};
`;

export default InputErrorMessage;
