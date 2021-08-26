import { Button, Paper } from "@material-ui/core";
import styled from "styled-components/macro";
import { Form } from "react-final-form";
import { Link } from "react-router-dom";

import TextField from "../forms/final-form-fields/TextField";
import useValidateInput from "../hooks/useValidateInput";
import useTranslate from "../hooks/useTranslate";
import useRegister from "../hooks/useRegister";
import useRoutes from "../hooks/useRoutes";
import Row from "../common/Row";

const Register = () => {
  const { validateInput } = useValidateInput();
  const register = useRegister();
  const { routes } = useRoutes();
  const i18n = useTranslate();

  const validate = formState => {
    const { email, password, confirmPassword } = formState;
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

    return errors;
  };

  return (
    <Wrap>
      <Form
        onSubmit={register}
        validate={validate}
        render={({ handleSubmit }) => (
          <StyledPaper>
            <form onSubmit={handleSubmit}>
              <Row className="is-aligned-center">
                <h2>{i18n("LOGIN.WELCOME")}</h2>
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
