import { Button, Paper } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import styled from "styled-components";
import { format } from "date-fns";

import useValidateInput from "../hooks/useValidateInput";
import TextField from "../forms/fields/TextField";
import useTranslate from "../hooks/useTranslate";
import { getMeal } from "../api/meal";
import Table from "../common/Table";

const Meal = () => {
  const [mealRecords, setMealRecords] = useState(false);
  const { validateInput } = useValidateInput();
  const i18n = useTranslate();

  const handleEdit = () => {};
  const handleRemove = () => {};

  const onSubmit = values => console.log(values);

  const validate = formState => {
    const { email, password } = formState;
    const errors = {};

    validateInput([
      {
        name: "email",
        value: email,
        rules: {
          isRequired: true,
          isEmail: true,
        },
        errors,
      },
      {
        name: "password",
        value: password,
        rules: {
          isRequired: true,
          minLength: 6,
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
    <StyledPaper>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit }) => (
          <StyledFormWrapper>
            <form onSubmit={handleSubmit}>
              <Row>
                <TextField name="email" label={i18n("FIELD_LABELS.EMAIL")} />
              </Row>

              {/* <Row>
                <DateTimePicker name="email" label={i18n("FIELD_LABELS.EMAIL")} />
              </Row> */}

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
    </StyledPaper>
  );
};

export default Meal;

const StyledPaper = styled(Paper)`
  flex-grow: 1;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)}px;
`;

const StyledFormWrapper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`;

const Row = styled.div`
  margin-bottom: ${({ theme }) => `${theme.spacing(3)}px`};

  &:last-of-type {
    margin-bottom: 0;
  }

  &.is-aligned-right {
    text-align: right;
  }

  &.is-aligned-center {
    text-align: center;
  }
`;
