import { useCallback, useEffect, useState } from "react";
import { Button, Paper } from "@material-ui/core";
import { Form } from "react-final-form";
import styled from "styled-components";
import { format } from "date-fns";

import DateTimePicker from "../forms/final-form-fields/DateTimePicker";
import TextField from "../forms/final-form-fields/TextField";
import useValidateInput from "../hooks/useValidateInput";
import assetTypes from "../../_constants/assetTypes";
import dateFormat from "../../_constants/dateFormat";
import useTranslate from "../hooks/useTranslate";
import WeightChart from "../common/WeightChart";
import useApi from "../hooks/useApi";
import Table from "../common/Table";
import Row from "../common/Row";

const Weight = () => {
  const [weightRecords, setWeightRecords] = useState(false);
  const { validateInput } = useValidateInput();
  const { create, getAll } = useApi();
  const i18n = useTranslate();

  const handleEdit = () => {};
  const handleRemove = () => {};

  const onSubmit = values => create(assetTypes.weight.name, values).then(fetchChartData);

  const validate = formState => {
    const { mass, day } = formState;
    const errors = {};

    validateInput([
      {
        name: "mass",
        value: mass,
        rules: {
          isRequired: true,
        },
        errors,
      },
      {
        name: "day",
        value: day,
        rules: {
          isRequired: true,
        },
        errors,
      },
    ]);

    return errors;
  };

  const fetchChartData = useCallback(
    () => getAll(assetTypes.weight.name).then(({ data }) => setWeightRecords(data)),
    [getAll]
  );

  useEffect(() => {
    !weightRecords && fetchChartData();
  }, [getAll, fetchChartData, weightRecords]);

  return (
    <>
      <ChartWrap>
        <WeightChart weightRecords={weightRecords} />
      </ChartWrap>

      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit }) => (
          <StyledFormWrapper>
            <form onSubmit={handleSubmit}>
              <Row>
                <TextField name="mass" label={i18n("FIELD_LABELS.MASS")} />
              </Row>

              <Row>
                <DateTimePicker name="day" />
              </Row>

              <Row className="is-aligned-right">
                <Button variant="contained" color="primary" type="submit">
                  {i18n("GENERAL_ACTIONS.SUBMIT")}
                </Button>
              </Row>
            </form>
          </StyledFormWrapper>
        )}
      />

      <Table
        hasActions
        isLoading={!weightRecords}
        data={weightRecords || []}
        handleEdit={handleEdit}
        handleRemove={handleRemove}
        structure={[
          {
            header: "Weight",
            accessor: "mass",
          },
          {
            header: "Date",
            accessor: ({ day }) => format(new Date(day), dateFormat),
          },
        ]}
      />
    </>
  );
};

export default Weight;

const StyledFormWrapper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;

const ChartWrap = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;
