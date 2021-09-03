import { toast } from "react-toastify";
import { useCallback } from "react";

import errorStatus from "../../_constants/errorStatus";
import useTranslate from "./useTranslate";

const useHandleHttpError = () => {
  const i18n = useTranslate();

  const handleError = useCallback(
    ({ response }) =>
      toast.error(i18n(errorStatus[response.status] || "TOAST_MESSAGES.SOMETHING_WENT_WRONG")),
    [i18n]
  );

  return handleError;
};

export default useHandleHttpError;
