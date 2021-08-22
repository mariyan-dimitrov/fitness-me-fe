import styled from "styled-components/macro";
import { Paper } from "@material-ui/core";

const Homepage = () => {
  return <StyledPaper>Homepage</StyledPaper>;
};

export default Homepage;

const StyledPaper = styled(Paper)`
  width: 100%;
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing(2)}px;
`;
