import { useCallback, useEffect, useState } from "react";

import assetTypes from "../../_constants/assetTypes";
import MealForm from "../forms/MealForm";
import useApi from "../hooks/useApi";
import Table from "../common/Table";

const Meal = () => {
  const [removeModeValues, setRemoveModeValues] = useState({});
  const [editModeValues, setEditModeValues] = useState({});
  const [foodRecords, setFoodRecords] = useState(false);
  const [mealRecords, setMealRecords] = useState(false);
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

  const getAllFoods = useCallback(
    () => getAll(assetTypes.food.name).then(({ data }) => setFoodRecords(data)),
    [getAll]
  );

  const onSubmit = values => {
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

  useEffect(() => {
    !foodRecords && getAllFoods();
  }, [getAllFoods, foodRecords]);

  return (
    <>
      <MealForm
        onSubmit={onSubmit}
        cancelEdit={cancelEdit}
        foodRecords={foodRecords}
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
            header: "Food Name",
            accessor: ({ foodId }) => foodRecords.find(foodRecord => foodRecords.foodId === foodId),
          },
          {
            header: "Portion",
            accessor: "Portion",
          },
        ]}
      />
    </>
  );
};

export default Meal;
