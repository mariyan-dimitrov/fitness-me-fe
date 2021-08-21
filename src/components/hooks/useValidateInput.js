import { useMemo, useCallback } from "react";
import useTranslate from "./useTranslate";

const useValidateInput = () => {
  const i18n = useTranslate();

  const validate = useCallback(
    ({ name, value, rules = {}, errors = {} }) => {
      const {
        isEmail,
        isNumber,
        onlyText,
        minValue,
        minLength,
        maxLength,
        isEqualTo,
        isRequired,
        shouldMatch,
        noWhiteSpace,
        noStartSpaces,
        containsNumber,
        betweenValues,
        requireCapitalLatter,
        containsSpecialChars,
      } = rules;

      const addError = message => {
        errors[name] = message;
      };

      if (isRequired && !value?.toString()) {
        addError(i18n("FORM_VALIDATION_MESSAGES.FIELD_IS_REQUIRED"));
      }

      if (minLength && value && value.length < minLength) {
        addError(i18n("FORM_VALIDATION_MESSAGES.MUST_CONTAIN_CHARACTERS", { minLength }));
      }

      if (maxLength && value && value.length > maxLength) {
        addError(
          i18n("FORM_VALIDATION_MESSAGES.MUST_NOT_CONTAIN_MORE_THAN_CHARACTERS", { maxLength })
        );
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

      if (onlyText && value && value.match(/[0-9!@#$%^&*(),.?":{}|<>]/)) {
        addError(i18n("FORM_VALIDATION_MESSAGES.MUST_NOT_CONTAIN_ANY_NUMBERS"));
      }

      if (noStartSpaces && value && value.match(/^[\s]/g)) {
        addError(i18n("FORM_VALIDATION_MESSAGES.SHOULD_NOT_START_WITH_EMPTY_SPACE"));
      }

      if (containsSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        addError(i18n("FORM_VALIDATION_MESSAGES.SHOULD_NOT_CONTAIN_ANY_SPECIAL_CHARACTERS"));
      }

      if (containsNumber && !/[0-9]/.test(value)) {
        addError(i18n("FORM_VALIDATION_MESSAGES.SHOULD_CONTAIN_A_NUMBER"));
      }

      if (requireCapitalLatter && !/[A-Z]/.test(value)) {
        addError(i18n("FORM_VALIDATION_MESSAGES.SHOULD_CONTAIN_A_CAPITAL_LETTER"));
      }

      if (noWhiteSpace && /^\s+|\s+$/.test(value)) {
        addError(i18n("FORM_VALIDATION_MESSAGES.TRAILING_SPACES_ARE_NOT_ALLOWED"));
      }

      if (shouldMatch && value && value !== shouldMatch) {
        addError(i18n("FORM_VALIDATION_MESSAGES.INPUTS_DOESNT_MATCH"));
      }

      if (value && value.length < 8 && /^\s+|\s+$/.test(value)) {
        addError(i18n("FORM_VALIDATION_MESSAGES.SHOULD_NOT_END_WITH_TRAILING_SPACES"));
      }

      if (
        betweenValues &&
        (betweenValues.min > Number(value) || betweenValues.max < Number(value))
      ) {
        addError(
          i18n("FORM_VALIDATION_MESSAGES.SHOULD_BE_BETWEEN_VALUES", {
            min: betweenValues.min,
            max: betweenValues.max,
          })
        );
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

  const isWebsiteLink = str => {
    const regexp =
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

    if (regexp.test(str)) {
      return str.match(/https|http/) ? str : `http://${str}`;
    } else {
      return false;
    }
  };

  return useMemo(
    () => ({
      validateInput,
      validate,
      isEmailValid,
      isWebsiteLink,
    }),
    [validate, validateInput]
  );
};

export default useValidateInput;
