import { Button, Paper } from "@material-ui/core";
import styled from "styled-components/macro";
import { Form } from "react-final-form";
import { Link } from "react-router-dom";

import useValidateInput from "../../hooks/useValidateInput";
import TextField from "../../forms/final-form-fields/TextField";
import useTranslate from "../../hooks/useTranslate";
import useRoutes from "../../hooks/useRoutes";

const Register = () => {
  const { validateInput } = useValidateInput();
  const { routes } = useRoutes();
  const i18n = useTranslate();

  const onSubmit = values => {
    // TODO: Send request to the server
    console.log("values: ", values);
  };

  const validate = formState => {
    const { userName, email, password, confirmPassword } = formState;
    const errors = {};

    validateInput([
      {
        name: "userName",
        value: userName,
        rules: {
          isRequired: true,
        },
        errors,
      },
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
      {
        name: "confirmPassword",
        value: confirmPassword,
        rules: {
          isRequired: true,
          isEqualTo: password,
        },
        errors,
      },
    ]);

    console.log(errors);
    return errors;
  };

  return (
    <Wrap>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit }) => (
          <StyledPaper>
            <form onSubmit={handleSubmit}>
              <Row>
                <TextField name="userName" label={i18n("FIELD_LABELS.USERNAME")} />
              </Row>

              <Row>
                <TextField name="email" label={i18n("FIELD_LABELS.EMAIL")} />
              </Row>

              <Row>
                <TextField name="password" label={i18n("FIELD_LABELS.PASSWORD")} type="password" />
              </Row>

              <Row>
                <TextField
                  name="confirmPassword"
                  label={i18n("FIELD_LABELS.CONFIRM_PASSWORD")}
                  type="password"
                />
              </Row>

              <Row className="is-aligned-right">
                <Button variant="contained" color="primary" type="submit">
                  {i18n("GENERAL_ACTIONS.SUBMIT")}
                </Button>
              </Row>

              <Row className="is-aligned-center">
                {i18n("REGISTER.HAVE_AN_ACC", {
                  loginUrl: <Link to={routes.login.url}>{i18n("REGISTER.LOGIN")}</Link>,
                })}
              </Row>
            </form>
          </StyledPaper>
        )}
      />
    </Wrap>
  );
};

export default Register;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
`;

const StyledPaper = styled(Paper)`
  max-width: 450px;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing(6)}px`};

  form {
    display: flex;
    flex-direction: column;
  }
`;

const Row = styled.div`
  margin-bottom: ${({ theme }) => `${theme.spacing(2)}px`};

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
