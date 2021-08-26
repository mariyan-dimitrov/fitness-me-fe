import { useEffect, useState } from "react";

import assetTypes from "../../_constants/assetTypes";
import useApi from "../hooks/useApi";
import Table from "../common/Table";

const Foods = () => {
  const [foods, setFoods] = useState(false);
  const { getAll, remove } = useApi();

  const handleEdit = () => {};

  const handleRemove = item => {
    remove(assetTypes.food.name, item.id).then(console.log).catch(console.log);
  };

  useEffect(() => {
    !foods && getAll(assetTypes.food.name).then(({ data }) => setFoods(data));
  }, [foods, getAll]);

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
