import { Button, Paper } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import styled from "styled-components";

import DateTimePicker from "../forms/final-form-fields/DateTimePicker";
import useValidateInput from "../hooks/useValidateInput";
import TextField from "../forms/fields/TextField";
import useTranslate from "../hooks/useTranslate";
import WeightChart from "../common/WeightChart";
import { getWeight } from "../api/weight";
import Table from "../common/Table";
import Row from "../common/Row";

const Weight = () => {
  const [weightRecords, setWeightRecords] = useState(false);
  const { validateInput } = useValidateInput();
  const i18n = useTranslate();

  const handleEdit = () => {};
  const handleRemove = () => {};

  const onSubmit = values => console.log(values);

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

  useEffect(() => {
    !weightRecords &&
      getWeight(2).finally(() => {
        setWeightRecords([
          {
            foodName: "Banana",
            grams: 200,
            calories: 300,
            id: 1,
          },
          {
            foodName: "Apple",
            grams: 400,
            calories: 500,
            id: 2,
          },
          {
            foodName: "Brocolly",
            grams: 1000,
            calories: 200,
            id: 3,
          },
        ]);
      });
  }, [weightRecords]);

  return (
    <>
      <ChartWrap>
        <WeightChart />
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
            header: "Food Name",
            accessor: "foodName",
          },
          {
            header: "Portion in grams",
            accessor: "grams",
          },
          {
            header: "Calories",
            accessor: "calories",
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
