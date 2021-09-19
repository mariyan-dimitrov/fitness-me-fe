import { useCallback, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import format from "date-fns/format";

import assetTypes from "../../_constants/assetTypes";
import dateFormat from "../../_constants/dateFormat";
import useTranslate from "../hooks/useTranslate";
import WeightChart from "../common/WeightChart";
import WeightForm from "../forms/WeightForm";
import useApi from "../hooks/useApi";
import Table from "../common/Table";

const Weight = () => {
  const [removeModeValues, setRemoveModeValues] = useState({});
  const [weightRecords, setWeightRecords] = useState(false);
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

      change(assetTypes.weight.name, values.id, payload).then(() => {
        fetchData();
        cancelEdit();
      });
    } else if (removeMode) {
      remove(assetTypes.weight.name, values.id).then(() => {
        fetchData();
        cancelRemove();
      });
    } else {
      create(assetTypes.weight.name, values).then(fetchData);
    }
  };

  const fetchData = useCallback(
    () => getAll(assetTypes.weight.name).then(({ data }) => setWeightRecords(data)),
    [getAll]
  );

  useEffect(() => {
    !weightRecords && fetchData();
  }, [getAll, fetchData, weightRecords]);

  return (
    <>
      <ChartWrap elevation={3}>
        <WeightChart weightRecords={weightRecords} />
      </ChartWrap>

      <WeightForm
        onSubmit={onSubmit}
        cancelEdit={cancelEdit}
        cancelRemove={cancelRemove}
        editModeValues={editModeValues}
        removeModeValues={removeModeValues}
      />

      <Table
        csvFileName={`${i18n("CSV_FILENAMES.WEIGHT_RECORDS")} ${format(new Date(), dateFormat)}`}
        isLoading={!weightRecords}
        data={weightRecords || []}
        handleEdit={handleStartEdit}
        handleRemove={handleStartRemove}
        editingRowId={editModeValues.id}
        removingRowId={removeModeValues.id}
        structure={[
          {
            header: i18n("WEIGHT_PAGE.WEIGHT_KG"),
            accessor: "mass",
            key: "mass",
          },
          {
            header: i18n("WEIGHT_PAGE.DATE"),
            accessor: ({ day }) => format(new Date(day), dateFormat),
            key: "day",
          },
        ]}
      />
    </>
  );
};

export default Weight;

const ChartWrap = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;
