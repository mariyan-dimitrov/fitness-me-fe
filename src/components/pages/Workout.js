import { useCallback, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import format from "date-fns/format";

import assetTypes from "../../_constants/assetTypes";
import dateFormat from "../../_constants/dateFormat";
import useTranslate from "../hooks/useTranslate";
import WorkoutChart from "../common/WorkoutChart";
import WorkoutForm from "../forms/WorkoutForm";
import useApi from "../hooks/useApi";
import Table from "../common/Table";
import activityOptions from "../../_constants/activityOptions";

const Workout = () => {
  const [removeModeValues, setRemoveModeValues] = useState({});
  const [workoutRecords, setWorkoutRecords] = useState(false);
  const [editModeValues, setEditModeValues] = useState({});
  const { getAll, create, change, remove } = useApi();
  const i18n = useTranslate();

  const removeMode = Boolean(Object.keys(removeModeValues).length);
  const editMode = Boolean(Object.keys(editModeValues).length);

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

      change(assetTypes.workout.name, values.id, payload).then(() => {
        fetchChartData();
        cancelEdit();
      });
    } else if (removeMode) {
      remove(assetTypes.workout.name, values.id).then(() => {
        fetchChartData();
        cancelRemove();
      });
    } else {
      create(assetTypes.workout.name, values).then(fetchChartData);
    }
  };

  const fetchChartData = useCallback(
    () =>
      getAll(assetTypes.workout.name).then(({ data }) =>
        setWorkoutRecords(data.map(item => ({ ...item, date: new Date(item.date) })))
      ),
    [getAll]
  );

  useEffect(() => {
    !workoutRecords && fetchChartData();
  }, [getAll, fetchChartData, workoutRecords]);

  return (
    <>
      <ChartWrap elevation={3}>
        <WorkoutChart workoutRecords={workoutRecords} />
      </ChartWrap>

      <WorkoutForm
        onSubmit={onSubmit}
        cancelEdit={cancelEdit}
        cancelRemove={cancelRemove}
        editModeValues={editModeValues}
        removeModeValues={removeModeValues}
      />

      <Table
        csvFileName={`${i18n("CSV_FILENAMES.WORKOUT_RECORDS")} ${format(new Date(), dateFormat)}`}
        isLoading={!workoutRecords}
        data={workoutRecords || []}
        handleEdit={handleStartEdit}
        handleRemove={handleStartRemove}
        editingRowId={editModeValues.id}
        removingRowId={removeModeValues.id}
        structure={[
          {
            header: i18n("WORKOUT_PAGE.DISTANCE_KM"),
            accessor: "distance",
            sortByKey: "distance",
            key: "distance",
          },
          {
            header: i18n("WORKOUT_PAGE.ACTIVITY"),
            accessor: ({ categoryId }) =>
              i18n(activityOptions.find(({ value }) => value === categoryId)?.name),
            sortByKey: "activity",
            key: "activity",
          },
          {
            header: i18n("WORKOUT_PAGE.DATE"),
            accessor: ({ date }) => format(date, dateFormat),
            sortByKey: "date",
            key: "date",
          },
        ]}
      />
    </>
  );
};

export default Workout;

const ChartWrap = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;
