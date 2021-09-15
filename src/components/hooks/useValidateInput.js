import { useMemo, useCallback } from "react";
import useTranslate from "./useTranslate";

const useValidateInput = () => {
  const i18n = useTranslate();

  const validate = useCallback(
    ({ name, value, rules = {}, errors = {} }) => {
      const { isEmail, isNumber, minValue, minLength, isEqualTo, notIn, isRequired } = rules;

      const addError = message => {
        errors[name] = message;
      };

      if (isRequired && !value?.toString()) {
        addError(i18n("FORM_VALIDATION_MESSAGES.FIELD_IS_REQUIRED"));
      }

      if (minLength && value && value.length < minLength) {
        addError(i18n("FORM_VALIDATION_MESSAGES.MUST_CONTAIN_CHARACTERS", { minLength }));
      }

      if (minValue && value < minValue) {
        addError(i18n("FORM_VALIDATION_MESSAGES.MUST_BE_HIGHER_THAN", { minValue }));
      }

      if (isNumber && value && !value.toString().match(/^[+-]?([0-9]*[.])?[0-9]+$/)) {
        addError(i18n("FORM_VALIDATION_MESSAGES.MUST_CONTAIN_ONLY_NUMBERS"));
      }

      if (isEmail && !isEmailValid(value)) {
        addError(i18n("FORM_VALIDATION_MESSAGES.INVALID_EMAIL"));
      }

      if (isEqualTo && isEqualTo !== value) {
        addError(i18n("FORM_VALIDATION_MESSAGES.VALUES_DONT_MATCH"));
      }

      if (notIn && notIn.includes(value)) {
        addError(i18n("FORM_VALIDATION_MESSAGES.ENTRY_ALREADY_EXISTS"));
      }

      if (value && value.length < 8 && /^\s+|\s+$/.test(value)) {
        addError(i18n("FORM_VALIDATION_MESSAGES.SHOULD_NOT_END_WITH_TRAILING_SPACES"));
      }
    },
    [i18n]
  );

  const validateInput = useCallback(
    data => {
      if (Array.isArray(data)) {
        data.forEach(validate);
      } else {
        validate(data);
      }
    },
    [validate]
  );

  const isEmailValid = email => {
    const tester =
      /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!email || typeof email !== "string" || email.length > 254 || !tester.test(email)) {
      return false;
    }

    if (email.includes("@")) {
      const parts = email.split("@");
      const domainParts = parts[1].split(".");

      if (parts[0].length > 64 || domainParts.some(part => part.length > 63)) {
        return false;
      }
    }

    return true;
  };

  return useMemo(
    () => ({
      validateInput,
      validate,
    }),
    [validate, validateInput]
  );
};

export default useValidateInput;
