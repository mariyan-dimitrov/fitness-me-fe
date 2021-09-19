import { Button, Paper } from "@material-ui/core";
import { Form } from "react-final-form";
import styled from "styled-components";
import cn from "classnames";

import useValidateInput from "../hooks/useValidateInput";
import TextField from "./final-form-fields/TextField";
import useTranslate from "../hooks/useTranslate";
import hexToRgb from "../../utils/hexToRgb";
import FoodStat from "../common/FoodStat";
import Row from "../common/Row";

const FoodForm = ({
  onSubmit,
  cancelEdit,
  foodRecords,
  cancelRemove,
  editModeValues = {},
  removeModeValues = {},
}) => {
  const { validateInput } = useValidateInput();
  const i18n = useTranslate();

  const removeMode = Boolean(Object.keys(removeModeValues).length);
  const editMode = Boolean(Object.keys(editModeValues).length);

  const validate = formState => {
    const { name, protein, carbs, fats } = formState;

    const errors = {};

    validateInput([
      {
        name: "name",
        value: name,
        rules: {
          isRequired: true,
          notIn: !editMode && foodRecords ? foodRecords.map(({ name }) => name) : [],
        },
        errors,
      },
      {
        name: "protein",
        value: protein,
        rules: {
          isRequired: true,
          isNumber: true,
          minValue: 0,
        },
        errors,
      },
      {
        name: "carbs",
        value: carbs,
        rules: {
          isRequired: true,
          isNumber: true,
          minValue: 0,
        },
        errors,
      },
      {
        name: "fats",
        value: fats,
        rules: {
          isRequired: true,
          isNumber: true,
          minValue: 0,
        },
        errors,
      },
    ]);

    return errors;
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      initialValues={removeMode ? removeModeValues : editModeValues}
      render={({ handleSubmit, form, errors, values }) => {
        const hasErrors = Boolean(Object.keys(errors).length);

        return (
          <StyledFormWrapper
            elevation={3}
            className={cn({ "edit-mode": editMode, "remove-mode": removeMode })}
          >
            <form
              onSubmit={event => {
                handleSubmit(event);
                !hasErrors && form.restart();
              }}
            >
              <Row className="is-aligned-center">
                {!editMode && !removeMode && <h2>{i18n("FOOD_PAGE.ADD_NEW_FOOD_PRODUCT")}</h2>}
                {editMode && <h2>{i18n("FOOD_PAGE.EDIT_FOOD_PRODUCT")}</h2>}
                {removeMode && <h2>{i18n("FOOD_PAGE.REMOVE_FOOD_PRODUCT")}</h2>}
              </Row>

              <Row>
                <TextField name="name" label={i18n("FOOD_PAGE.NAME")} disabled={removeMode} />
              </Row>

              <Row className="is-aligned-center">
                <Divider
                  className={cn({ "edit-mode": editMode, "remove-mode": removeMode })}
                  text={i18n("FOOD_PAGE.CONTAINS_PER_100")}
                />
              </Row>

              <Row>
                <TextField
                  name="protein"
                  type="number"
                  label={i18n("FOOD_PAGE.PROTEIN")}
                  disabled={removeMode}
                />
              </Row>

              <Row>
                <TextField
                  name="carbs"
                  type="number"
                  label={i18n("FOOD_PAGE.CARBS")}
                  disabled={removeMode}
                />
              </Row>

              <Row>
                <TextField
                  name="fats"
                  type="number"
                  label={i18n("FOOD_PAGE.FATS")}
                  disabled={removeMode}
                />
              </Row>

              <Row>
                <FoodStat {...values} />
              </Row>

              <Row className="is-aligned-right">
                {removeMode && (
                  <RemoveQuestion>{i18n("GENERAL_ACTIONS.ARE_YOU_SURE_DELETE")}</RemoveQuestion>
                )}

                {(editMode || removeMode) && (
                  <StyledButton
                    variant="contained"
                    onClick={e => {
                      e.preventDefault();
                      removeMode ? cancelRemove() : cancelEdit();
                    }}
                  >
                    {i18n("GENERAL_ACTIONS.CANCEL")}
                  </StyledButton>
                )}

                <Button variant="contained" color="primary" type="submit" disabled={hasErrors}>
                  {i18n(
                    editMode
                      ? "GENERAL_ACTIONS.EDIT"
                      : removeMode
                      ? "GENERAL_ACTIONS.REMOVE"
                      : "GENERAL_ACTIONS.ADD"
                  )}
                </Button>
              </Row>
            </form>
          </StyledFormWrapper>
        );
      }}
    />
  );
};

export default FoodForm;

const StyledFormWrapper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;

  &.edit-mode {
    background-color: ${({ theme }) => hexToRgb(theme.palette.primary.light, 0.3)};
  }

  &.remove-mode {
    background-color: ${({ theme }) => hexToRgb(theme.palette.error.light, 0.3)};
  }
`;

const StyledButton = styled(Button)`
  margin-right: ${({ theme }) => theme.spacing(2)}px;
  background-color: ${({ theme }) => theme.palette.error.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};

  &:hover {
    background-color: ${({ theme }) => theme.palette.error.dark};
  }
`;

const RemoveQuestion = styled.div`
  margin-right: ${({ theme }) => theme.spacing(2)}px;
`;

const Divider = styled.div`
  position: relative;
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.palette.text.disabled};

  &:after,
  &:before {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    content: "${({ text }) => text}";
    display: block;
    background-color: ${({ theme }) => theme.palette.background.paper};
    padding: ${({ theme }) => theme.spacing(1)}px;
  }

  &.edit-mode {
    &:after {
      background-color: ${({ theme }) => hexToRgb(theme.palette.primary.light, 0.3)};
    }
  }

  &.remove-mode {
    &:after {
      background-color: ${({ theme }) => hexToRgb(theme.palette.error.light, 0.3)};
    }
  }
`;
