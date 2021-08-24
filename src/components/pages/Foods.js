import styled from "styled-components/macro";
import { Paper } from "@material-ui/core";
import { useEffect, useState } from "react";

import { getFood, deleteFood } from "../api/food";
import Table from "../common/Table";

const Foods = () => {
  const [foods, setFoods] = useState(false);

  const handleEdit = () => {};

  const handleRemove = item => {
    deleteFood(item.id)
      .then(() => {})
      .catch(() => {});
  };

  useEffect(() => {
    // TODO: Change to adequate get all request
    !foods && getFood(3).then(({ data }) => setFoods([data.food]));
  }, [foods]);

  return (
    <StyledPaper>
      <Table
        isLoading={!foods}
        data={foods || []}
        hasActions
        structure={[
          {
            header: "Name",
            accessor: "name",
          },
          {
            header: "Calories",
            accessor: "calories",
          },
        ]}
        handleEdit={handleEdit}
        handleRemove={handleRemove}
      />
    </StyledPaper>
  );
};

export default Foods;

const StyledPaper = styled(Paper)`
  flex-grow: 1;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)}px;
`;
