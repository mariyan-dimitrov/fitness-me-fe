import styled from "styled-components/macro";
import { Paper } from "@material-ui/core";

import Table from "../common/Table";

const Foods = () => {
  return (
    <StyledPaper>
      <Table></Table>
    </StyledPaper>
  );
};

export default Foods;

const StyledPaper = styled(Paper)`
  flex-grow: 1;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)}px;
`;
