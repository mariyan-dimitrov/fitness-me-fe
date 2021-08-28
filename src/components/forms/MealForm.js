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
    const { foodId, portion, day } = formState;
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

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      initialValues={{
        ...(removeMode ? removeModeValues : editModeValues),
        day: format(new Date(), "yyyy-MM-dd'T'hh:mm"),
      }}
      render={({ handleSubmit, form, errors }) => (
        <StyledFormWrapper
          elevation={3}
          className={cn({ "edit-mode": editMode, "remove-mode": removeMode })}
        >
          <form
            onSubmit={event => {
              handleSubmit(event);
              !Object.keys(errors).length && form.restart();
            }}
          >
            <Row>
              <StyledAutocomplete
                name="foodId"
                options={foodRecords || []}
                label={i18n("FIELD_LABELS.FOOD")}
                disabled={removeMode}
              />
            </Row>

            <Row>
              <TextField
                name="portion"
                type="number"
                disabled={removeMode}
                label={i18n("FIELD_LABELS.PORTION")}
              />
            </Row>

            <Row>
              <DateTimePicker name="day" disabled={removeMode} />
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

              <Button variant="contained" color="primary" type="submit">
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
      )}
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
  color: ${({ theme }) => theme.palette.text.primary};

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
