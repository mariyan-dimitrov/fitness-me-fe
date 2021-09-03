import TablePagination from "@material-ui/core/TablePagination";
import { useCallback, useEffect, useState } from "react";

import assetTypes from "../../_constants/assetTypes";
import useTranslate from "../hooks/useTranslate";
import MealForm from "../forms/MealForm";
import useApi from "../hooks/useApi";
import Table from "../common/Table";

const Meal = () => {
  const [removeModeValues, setRemoveModeValues] = useState({});
  const [editModeValues, setEditModeValues] = useState({});
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [foodRecords, setFoodRecords] = useState(false);
  const [mealRecords, setMealRecords] = useState(false);
  const { getAll, create, change, remove } = useApi();
  const i18n = useTranslate();

  const editMode = Boolean(Object.keys(editModeValues).length);
  const removeMode = Boolean(Object.keys(removeModeValues).length);

  const handleStartRemove = item => {
    cancelEdit();
    setRemoveModeValues(item);
  };
  const handleStartEdit = item => {
    cancelRemove();
    setEditModeValues(item);
  };

  const cancelRemove = () => setRemoveModeValues({});
  const cancelEdit = () => setEditModeValues({});

  const getAllMeals = useCallback(
    pagination => getAll(assetTypes.meal.name, pagination).then(({ data }) => setMealRecords(data)),
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
    getAllMeals({ pageSize, pageNumber });
  }, [getAllMeals, pageSize, pageNumber]);

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
            header: i18n("MEAL_PAGE.TYPE_OF_FOOD"),
            accessor: ({ foodId }) => foodRecords.find(foodRecord => foodRecords.foodId === foodId),
          },
          {
            header: i18n("MEAL_PAGE.PORTIONS"),
            accessor: "Portion",
          },
        ]}
      />

      <TablePagination
        component="div"
        count={100}
        page={pageNumber}
        onPageChange={(event, newPage) => setPageNumber(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={event => {
          setPageSize(parseInt(event.target.value, 10));
          setPageNumber(0);
        }}
      />
    </>
  );
};

export default Meal;
