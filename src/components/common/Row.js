import styled from "styled-components/macro";

const Row = styled.div`
  margin-bottom: ${({ theme }) => `${theme.spacing(3)}px`};

  &:last-of-type {
    margin-bottom: 0;
  }

  &.is-aligned-right {
    text-align: right;
  }

  &.is-aligned-center {
    text-align: center;
  }
`;

export default Row;
