import { useCallback, useEffect, useState } from "react";

import assetTypes from "../../_constants/assetTypes";
import MealForm from "../forms/MealForm";
import useApi from "../hooks/useApi";
import Table from "../common/Table";

const Meal = () => {
  const [mealRecords, setMealRecords] = useState(false);
  const [removeModeValues, setRemoveModeValues] = useState({});
  const [editModeValues, setEditModeValues] = useState({});
  const { getAll, create, change, remove } = useApi();

  const editMode = Boolean(Object.keys(editModeValues).length);
  const removeMode = Boolean(Object.keys(removeModeValues).length);

  const handleStartRemove = item => setRemoveModeValues(item);
  const handleStartEdit = item => setEditModeValues(item);
  const cancelRemove = () => setRemoveModeValues({});
  const cancelEdit = () => setEditModeValues({});

  const getAllMeals = useCallback(
    () => getAll(assetTypes.meal.name).then(({ data }) => setMealRecords(data)),
    [getAll]
  );

  const onSubmit = values => {
    console.log("values: ", values);
    if (editMode) {
      const payload = { ...values };
      change(assetTypes.meal.name, values.id, payload).then(() => {
        getAllMeals();
        cancelEdit();
      });
    } else if (removeMode) {
      remove(assetTypes.meal.name, values.id).then(() => {
        getAllMeals();
        cancelRemove();
      });
    } else {
      create(assetTypes.meal.name, values).then(getAllMeals);
    }
  };

  useEffect(() => {
    !mealRecords && getAllMeals();
  }, [getAllMeals, mealRecords]);

  return (
    <>
      <MealForm
        onSubmit={onSubmit}
        cancelEdit={cancelEdit}
        cancelRemove={cancelRemove}
        editModeValues={editModeValues}
        removeModeValues={removeModeValues}
      />

      <Table
        hasActions
        isLoading={!mealRecords}
        data={mealRecords || []}
        handleEdit={handleStartEdit}
        handleRemove={handleStartRemove}
        editingRowId={editModeValues.id}
        removingRowId={removeModeValues.id}
        structure={[
          {
            header: "Mass",
            accessor: "mass",
          },
          {
            header: "Day",
            accessor: "day",
          },
        ]}
      />
    </>
  );
};

export default Meal;
