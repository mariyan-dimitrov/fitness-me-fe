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
    <>
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
    </>
  );
};

export default Foods;
