import { Button, Paper } from "@material-ui/core";
import styled from "styled-components/macro";
import { Form } from "react-final-form";
import { Link } from "react-router-dom";

import TextField from "../forms/final-form-fields/TextField";
import Checkbox from "../forms/final-form-fields/Checkbox";
import useValidateInput from "../hooks/useValidateInput";
import useTranslate from "../hooks/useTranslate";
import useRoutes from "../hooks/useRoutes";
import useLogin from "../hooks/useLogin";
import Row from "../common/Row";

const Login = () => {
  const { validateInput } = useValidateInput();
  const { routes } = useRoutes();
  const i18n = useTranslate();
  const login = useLogin();

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

  return (
    <Wrap>
      <Form
        onSubmit={login}
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
                <Checkbox name="rememberMe" label={i18n("FIELD_LABELS.REMEMBER_ME")} />
              </Row>

              <Row className="is-aligned-right">
                <Button variant="contained" color="primary" type="submit">
                  {i18n("GENERAL_ACTIONS.SUBMIT")}
                </Button>
              </Row>

              <Row className="is-aligned-center">
                {i18n("LOGIN.DONT_HAVE_AN_ACC", {
                  registerUrl: (
                    <StyledLink to={routes.register.url}>{i18n("LOGIN.REGISTER")}</StyledLink>
                  ),
                })}
              </Row>
            </form>
          </StyledPaper>
        )}
      />
    </Wrap>
  );
};

export default Login;

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

const StyledLink = styled(Link)`
  margin-left: ${({ theme }) => theme.spacing(1)}px;
`;
