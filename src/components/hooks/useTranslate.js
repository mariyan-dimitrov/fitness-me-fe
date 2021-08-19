import React, { isValidElement, Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";

const useTranslate = () => {
  const { t } = useTranslation();

  const i18n = useCallback(
    (text, elementsMap) => {
      const hasReactElement = elementsMap && Object.values(elementsMap).some(isValidElement);

      if (hasReactElement) {
        const escapedElements = Object.keys(elementsMap).reduce((result, key) => {
          result[key] = `{{${key}}}`;
          return result;
        }, {});

        const translatedText = t(text, escapedElements);
        const translatedTextParts = translatedText
          .split(/{{(.+?)}}/)
          .filter(textPart => textPart !== "");

        return translatedTextParts.map((part, index) => (
          <Fragment key={`${part}-${index}`}>{elementsMap[part] || part}</Fragment>
        ));
      }

      return t(text, elementsMap);
    },
    [t]
  );

  return i18n;
};

export default useTranslate;
