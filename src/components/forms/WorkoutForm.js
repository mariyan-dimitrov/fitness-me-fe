import { Button, Paper } from "@material-ui/core";
import { Form } from "react-final-form";
import styled from "styled-components";
import format from "date-fns/format";
import cn from "classnames";

import DateTimePicker from "./final-form-fields/DateTimePicker";
import activityOptions from "../../_constants/activityOptions";
import useValidateInput from "../hooks/useValidateInput";
import TextField from "./final-form-fields/TextField";
import useTranslate from "../hooks/useTranslate";
import Select from "./final-form-fields/Select";
import hexToRgb from "../../utils/hexToRgb";
import Row from "../common/Row";

const WorkoutForm = ({
  onSubmit,
  cancelEdit,
  cancelRemove,
  editModeValues = {},
  removeModeValues = {},
}) => {
  const { validateInput } = useValidateInput();
  const i18n = useTranslate();

  const removeMode = Boolean(Object.keys(removeModeValues).length);
  const editMode = Boolean(Object.keys(editModeValues).length);

  const validate = formState => {
    const { distance, date } = formState;
    const errors = {};

    validateInput([
      {
        name: "distance",
        value: distance,
        rules: {
          isRequired: true,
          isNumber: true,
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
        date: format(new Date(), "yyyy-MM-dd'T'hh:mm"),
        categoryId: "0",
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
                {!editMode && !removeMode && (
                  <h2>{i18n("WORKOUT_PAGE.HOW_MUCH_DID_YOU_WORKOUT")}</h2>
                )}
                {editMode && <h2>{i18n("WORKOUT_PAGE.EDIT_WORKOUT_RECORD")}</h2>}
                {removeMode && <h2>{i18n("WORKOUT_PAGE.REMOVE_WORKOUT_RECORD")}</h2>}
              </Row>

              <Row>
                <TextField
                  name="distance"
                  type="number"
                  label={i18n("FIELD_LABELS.DISTANCE_KM")}
                  disabled={removeMode}
                />
              </Row>

              <Row>
                <Select
                  name="categoryId"
                  type="number"
                  label={i18n("FIELD_LABELS.ACTIVITY")}
                  disabled={removeMode}
                  options={activityOptions}
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

export default WorkoutForm;

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
