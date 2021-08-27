import styled from "styled-components/macro";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => `${theme.spacing(3)}px`};

  &:last-of-type {
    margin-bottom: 0;
  }

  &.is-aligned-right {
    justify-content: flex-end;
  }

  &.is-aligned-center {
    justify-content: center;
  }
`;

export default Row;
