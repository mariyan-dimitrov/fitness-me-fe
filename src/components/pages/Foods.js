import { useEffect, useState, useCallback } from "react";

import assetTypes from "../../_constants/assetTypes";
import FoodForm from "../forms/FoodForm";
import useApi from "../hooks/useApi";
import Table from "../common/Table";

const Foods = () => {
  const [removeModeValues, setRemoveModeValues] = useState({});
  const [foodRecords, setFoodRecords] = useState(false);
  const [editModeValues, setEditModeValues] = useState({});
  const { getAll, create, change, remove } = useApi();

  const editMode = Boolean(Object.keys(editModeValues).length);
  const removeMode = Boolean(Object.keys(removeModeValues).length);

  const handleStartRemove = item => setRemoveModeValues(item);
  const handleStartEdit = item => setEditModeValues(item);
  const cancelRemove = () => setRemoveModeValues({});
  const cancelEdit = () => setEditModeValues({});

  const onSubmit = values => {
    if (editMode) {
      const payload = { ...values };

      change(assetTypes.food.name, values.id, payload).then(() => {
        fetchChartData();
        cancelEdit();
      });
    } else if (removeMode) {
      remove(assetTypes.food.name, values.id).then(() => {
        fetchChartData();
        cancelRemove();
      });
    } else {
      create(assetTypes.food.name, values).then(fetchChartData);
    }
  };

  const fetchChartData = useCallback(
    () => getAll(assetTypes.food.name).then(({ data }) => setFoodRecords(data)),
    [getAll]
  );

  useEffect(() => {
    !foodRecords && fetchChartData();
  }, [getAll, fetchChartData, foodRecords]);

  return (
    <>
      <FoodForm
        onSubmit={onSubmit}
        cancelEdit={cancelEdit}
        cancelRemove={cancelRemove}
        editModeValues={editModeValues}
        removeModeValues={removeModeValues}
      />
      <Table
        hasActions
        isLoading={!foodRecords}
        data={foodRecords || []}
        handleEdit={handleStartEdit}
        handleRemove={handleStartRemove}
        editingRowId={editModeValues.id}
        removingRowId={removeModeValues.id}
        structure={[
          {
            header: "Name",
            accessor: "name",
          },
          {
            header: "Protein",
            accessor: "protein",
          },
          {
            header: "Carbs",
            accessor: "carbs",
          },
          {
            header: "Fats",
            accessor: "fats",
          },
        ]}
      />
    </>
  );
};

export default Foods;
