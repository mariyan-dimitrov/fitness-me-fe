import { Button, Paper } from "@material-ui/core";
import { Form } from "react-final-form";
import styled from "styled-components";
import cn from "classnames";

import TextField from "./final-form-fields/TextField";
import useValidateInput from "../hooks/useValidateInput";
import useTranslate from "../hooks/useTranslate";
import hexToRgb from "../../utils/hexToRgb";
import Row from "../common/Row";

const FoodForm = ({
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
    const { name, protein, carbs, fats } = formState;
    const errors = {};

    validateInput([
      {
        name: "name",
        value: name,
        rules: {
          isRequired: true,
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
      render={({ handleSubmit, form, errors }) => (
        <StyledFormWrapper className={cn({ "edit-mode": editMode, "remove-mode": removeMode })}>
          <form
            onSubmit={event => {
              handleSubmit(event);
              !Object.keys(errors).length && form.restart();
            }}
          >
            <Row>
              <TextField name="name" label={i18n("FIELD_LABELS.NAME")} disabled={removeMode} />
            </Row>

            <Row>
              <TextField
                name="protein"
                type="number"
                label={i18n("FIELD_LABELS.PROTEIN")}
                disabled={removeMode}
              />
            </Row>

            <Row>
              <TextField
                name="carbs"
                type="number"
                label={i18n("FIELD_LABELS.CARBS")}
                disabled={removeMode}
              />
            </Row>

            <Row>
              <TextField
                name="fats"
                type="number"
                label={i18n("FIELD_LABELS.FATS")}
                disabled={removeMode}
              />
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
  color: ${({ theme }) => theme.palette.text.primary};

  &:hover {
    background-color: ${({ theme }) => theme.palette.error.dark};
  }
`;

const RemoveQuestion = styled.div`
  margin-right: ${({ theme }) => theme.spacing(2)}px;
`;
