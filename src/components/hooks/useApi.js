import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { useCookieContext } from "../contexts/CookieContext";
import session_storage from "../../utils/session_storage";
import hostURL from "../../_constants/serverApiUrl";
import useTranslate from "./useTranslate";

const errorStatus = {
  403: "TOAST_MESSAGES.NOT_ALLOWED",
};

const useApi = () => {
  const { cookies } = useCookieContext();
  const i18n = useTranslate();
  const token = session_storage.get("userToken") || cookies.userToken;

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const handleError = useCallback(
    ({ response }) => {
      toast.error(i18n(errorStatus[response.status]) || "TOAST_MESSAGES.SOMETHING_WENT_WRONG");
    },
    [i18n]
  );

  const getAll = useCallback(
    assetType =>
      axios({
        method: "GET",
        url: `${hostURL}/${assetType}`,
        headers: {
          ...headers,
        },
      }).catch(handleError),
    [handleError, headers]
  );

  const create = useCallback(
    (assetType, payload) =>
      axios({
        method: "POST",
        url: `${hostURL}/${assetType}`,
        data: payload,
        headers: {
          ...headers,
        },
      })
        .then(res => {
          toast.success(i18n(`TOAST_MESSAGES.${assetType.toUpperCase()}_CREATED`));
          return res;
        })
        .catch(handleError),
    [handleError, headers, i18n]
  );

  const remove = useCallback(
    (assetType, assetId) =>
      axios({
        method: "DELETE",
        url: `${hostURL}/${assetType}/${assetId}`,
        headers: {
          ...headers,
        },
      })
        .then(res => {
          toast.success(i18n(`TOAST_MESSAGES.${assetType.toUpperCase()}_DELETED`));
          return res;
        })
        .catch(handleError),
    [handleError, headers, i18n]
  );

  const change = useCallback(
    (assetType, assetId, payload) =>
      axios({
        method: "PUT",
        url: `${hostURL}/${assetType}/${assetId}`,
        data: payload,
        headers: {
          ...headers,
        },
      })
        .then(res => {
          toast.success(i18n(`TOAST_MESSAGES.${assetType.toUpperCase()}_CHANGED`));
          return res;
        })
        .catch(handleError),
    [handleError, headers, i18n]
  );

  return { getAll, create, remove, change };
};

export default useApi;
