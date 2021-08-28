import { useEffect, useState, useCallback } from "react";

import assetTypes from "../../_constants/assetTypes";
import useTranslate from "../hooks/useTranslate";
import FoodStat from "../common/FoodStat";
import FoodForm from "../forms/FoodForm";
import useApi from "../hooks/useApi";
import Table from "../common/Table";

const Foods = () => {
  const [removeModeValues, setRemoveModeValues] = useState({});
  const [editModeValues, setEditModeValues] = useState({});
  const [foodRecords, setFoodRecords] = useState(false);
  const i18n = useTranslate();
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
            header: i18n("FOOD_PAGE.NAME"),
            accessor: "name",
          },
          {
            header: i18n("FOOD_PAGE.PROTEIN"),
            accessor: "protein",
          },
          {
            header: i18n("FOOD_PAGE.CARBS"),
            accessor: "carbs",
          },
          {
            header: i18n("FOOD_PAGE.FATS"),
            accessor: "fats",
          },
          {
            header: i18n("FOOD_PAGE.OVERVIEW"),
            accessor: props => {
              return <FoodStat {...props} />;
            },
          },
        ]}
      />
    </>
  );
};

export default Foods;
