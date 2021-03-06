import { useEffect, useState, useCallback } from "react";
import format from "date-fns/format";

import { rolesForFoodActions } from "../../_constants/roles";
import { useGlobalContext } from "../contexts/GlobalContext";
import dateFormat from "../../_constants/dateFormat";
import assetTypes from "../../_constants/assetTypes";
import useTranslate from "../hooks/useTranslate";
import FoodStat from "../common/FoodStat";
import FoodForm from "../forms/FoodForm";
import useApi from "../hooks/useApi";
import Table from "../common/Table";

const Foods = () => {
  const { user } = useGlobalContext();
  const [removeModeValues, setRemoveModeValues] = useState({});
  const [editModeValues, setEditModeValues] = useState({});
  const [foodRecords, setFoodRecords] = useState(false);
  const i18n = useTranslate();
  const { getAll, create, change, remove } = useApi();

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
        foodRecords={foodRecords}
        cancelRemove={cancelRemove}
        editModeValues={editModeValues}
        removeModeValues={removeModeValues}
      />

      <Table
        canSearch
        isLoading={!foodRecords}
        data={foodRecords || []}
        csvFileName={`${i18n("CSV_FILENAMES.MEAL_RECORDS")} ${format(new Date(), dateFormat)}`}
        handleEdit={handleStartEdit}
        handleRemove={handleStartRemove}
        editingRowId={editModeValues.id}
        hasActions={rolesForFoodActions.includes(user.role)}
        removingRowId={removeModeValues.id}
        structure={[
          {
            header: i18n("FOOD_PAGE.NAME"),
            accessor: "name",
            sortByKey: "name",
            key: "name",
          },
          {
            header: i18n("FOOD_PAGE.PROTEIN"),
            accessor: "protein",
            sortByKey: "protein",
            key: "protein",
          },
          {
            header: i18n("FOOD_PAGE.CARBS"),
            accessor: "carbs",
            sortByKey: "carbs",
            key: "carbs",
          },
          {
            header: i18n("FOOD_PAGE.FATS"),
            accessor: "fats",
            sortByKey: "fats",
            key: "fats",
          },
          {
            header: i18n("FOOD_PAGE.OVERVIEW"),
            accessor: props => <FoodStat {...props} />,
            skipForCSV: true,
            key: "fats",
          },
        ]}
      />
    </>
  );
};

export default Foods;
