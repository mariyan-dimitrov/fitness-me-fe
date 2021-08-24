import { Button, Paper } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import styled from "styled-components";

import useValidateInput from "../hooks/useValidateInput";
import TextField from "../forms/fields/TextField";
import useTranslate from "../hooks/useTranslate";
import { getWeight } from "../api/weight";
import Table from "../common/Table";

const Weight = () => {
  const [weightRecords, setWeightRecords] = useState(false);
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
            id: 1,
          },
          {
            foodName: "Brocolly",
            grams: 1000,
            calories: 200,
            id: 1,
          },
        ]);
      });
  }, [weightRecords]);

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
    </StyledPaper>
  );
};

export default Weight;

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
