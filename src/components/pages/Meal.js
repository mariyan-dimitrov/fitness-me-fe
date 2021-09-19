import { useCallback, useEffect, useState } from "react";

import dateFormat from "../../_constants/dateFormat";
import assetTypes from "../../_constants/assetTypes";
import useTranslate from "../hooks/useTranslate";
import MealForm from "../forms/MealForm";
import format from "date-fns/format";
import useApi from "../hooks/useApi";
import Table from "../common/Table";

const Meal = () => {
  const [removeModeValues, setRemoveModeValues] = useState({});
  const [editModeValues, setEditModeValues] = useState({});
  const [foodRecords, setFoodRecords] = useState(false);
  const [mealRecords, setMealRecords] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
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
    pagination =>
      getAll(assetTypes.meal.name, pagination).then(({ data }) => {
        const enhancedData = data.map(item => {
          const correspondingItem = foodRecords.find(foodRecord => foodRecord.id === item.foodId);

          return correspondingItem
            ? {
                ...correspondingItem,
                ...item,
              }
            : item;
        });

        setMealRecords(enhancedData);
      }),
    [getAll, foodRecords]
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
    foodRecords && getAllMeals({ pageSize, pageNumber });
  }, [getAllMeals, foodRecords, pageSize, pageNumber]);

  useEffect(() => {
    !foodRecords && getAllFoods();
  }, [getAllFoods, foodRecords]);

  if (!foodRecords) {
    return null;
  }

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
        csvFileName={`${i18n("CSV_FILENAMES.MEAL_RECORDS")} ${format(new Date(), dateFormat)}`}
        isLoading={!mealRecords}
        data={mealRecords || []}
        handleEdit={handleStartEdit}
        handleRemove={handleStartRemove}
        editingRowId={editModeValues.id}
        count={100}
        page={pageNumber}
        onPageChange={(event, newPage) => setPageNumber(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={event => {
          setPageSize(parseInt(event.target.value, 10));
          setPageNumber(0);
        }}
        removingRowId={removeModeValues.id}
        structure={[
          {
            header: i18n("MEAL_PAGE.TYPE_OF_FOOD"),
            accessor: ({ foodId }) =>
              foodRecords.find(foodRecord => foodRecord.id === foodId)?.name,
            sortByKey: "name",
            key: "foodId",
          },
          {
            header: i18n("MEAL_PAGE.PORTIONS"),
            sortByKey: "portion",
            accessor: "portion",
            key: "Portion",
          },
        ]}
      />
    </>
  );
};

export default Meal;
