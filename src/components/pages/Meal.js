import { Button, Paper } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import styled from "styled-components";
import { format } from "date-fns";

import DateTimePicker from "../forms/final-form-fields/DateTimePicker";
import TextField from "../forms/final-form-fields/TextField";
import useValidateInput from "../hooks/useValidateInput";
import useTranslate from "../hooks/useTranslate";
import { getMeal } from "../api/meal";
import Table from "../common/Table";
import Row from "../common/Row";

const Meal = () => {
  const [mealRecords, setMealRecords] = useState(false);
  const { validateInput } = useValidateInput();
  const i18n = useTranslate();

  const handleEdit = () => {};
  const handleRemove = () => {};

  const onSubmit = values => console.log(values);

  const validate = formState => {
    const { food, day } = formState;
    const errors = {};

    validateInput([
      {
        name: "food",
        value: food,
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
    !mealRecords &&
      getMeal(2).finally(() => {
        setMealRecords([
          {
            mass: 100,
            day: format(new Date("2021-05-03 06:35:00"), "dd/MM/yyyy"),
            id: 1,
          },
          {
            mass: 110,
            day: format(new Date("2021-06-03 06:35:00"), "dd/MM/yyyy"),
            id: 2,
          },
          {
            mass: 150,
            day: format(new Date("2021-07-03 06:35:00"), "dd/MM/yyyy"),
            id: 3,
          },
        ]);
      });
  }, [mealRecords]);

  return (
    <>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit }) => (
          <StyledFormWrapper>
            <form onSubmit={handleSubmit}>
              <Row>
                <TextField name="food" label={i18n("FIELD_LABELS.FOOD")} />
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
        isLoading={!mealRecords}
        data={mealRecords || []}
        handleEdit={handleEdit}
        handleRemove={handleRemove}
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

const StyledFormWrapper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;
