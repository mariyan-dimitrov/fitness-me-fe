import { Button, Paper } from "@material-ui/core";
import { Form } from "react-final-form";
import styled from "styled-components";
import format from "date-fns/format";
import cn from "classnames";

import DateTimePicker from "./final-form-fields/DateTimePicker";
import Autocomplete from "./final-form-fields/Autocomplete";
import useValidateInput from "../hooks/useValidateInput";
import TextField from "./final-form-fields/TextField";
import useTranslate from "../hooks/useTranslate";
import hexToRgb from "../../utils/hexToRgb";
import Row from "../common/Row";

const MealForm = ({
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
    const { foodId, portion, date } = formState;
    const errors = {};

    validateInput([
      {
        name: "foodId",
        value: foodId,
        rules: {
          isRequired: true,
        },
        errors,
      },
      {
        name: "portion",
        value: portion,
        rules: {
          isRequired: true,
          isNumber: true,
          minValue: 0,
        },

        errors,
      },
      {
        name: "date",
        value: date,
        rules: {
          isRequired: true,
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
      initialValues={{
        date: format(new Date(), "yyyy-MM-dd'T'k:mm"),
        ...(removeMode ? removeModeValues : editModeValues),
      }}
      render={({ handleSubmit, form, errors }) => {
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
                {!editMode && !removeMode && <h2>{i18n("MEAL_PAGE.WHAT_DID_YOU_EAT")}</h2>}
                {editMode && <h2>{i18n("MEAL_PAGE.EDIT_MEAL_RECORD")}</h2>}
                {removeMode && <h2>{i18n("MEAL_PAGE.REMOVE_MEAL_RECORD")}</h2>}
              </Row>

              <Row>
                <StyledAutocomplete
                  name="foodId"
                  options={foodRecords || []}
                  label={i18n("MEAL_PAGE.TYPE_OF_FOOD")}
                  disabled={removeMode}
                />
              </Row>

              <Row>
                <TextField
                  name="portion"
                  type="number"
                  disabled={removeMode}
                  label={i18n("MEAL_PAGE.PORTIONS")}
                />
              </Row>

              <Row>
                <DateTimePicker name="date" disabled={removeMode} />
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

export default MealForm;

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

const StyledAutocomplete = styled(Autocomplete)`
  width: 100%;
`;
