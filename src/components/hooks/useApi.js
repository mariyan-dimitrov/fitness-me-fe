import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import getSearchQueryFromObject from "../../utils/getSearchQueryFromObject";
import { useCookieContext } from "../contexts/CookieContext";
import session_storage from "../../utils/session_storage";
import useHandleHttpError from "./useHandleHttpError";
import hostURL from "../../_constants/serverApiUrl";
import useTranslate from "./useTranslate";

const useApi = () => {
  const { cookies } = useCookieContext();
  const handleHttpError = useHandleHttpError();
  const i18n = useTranslate();
  const token = session_storage.get("userToken") || cookies.userToken;

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const getAll = useCallback(
    (assetType, pagination) => {
      const query = pagination ? getSearchQueryFromObject(pagination) : "";

      return axios({
        method: "GET",
        url: `${hostURL}/${assetType}${query}`,
        headers: {
          ...headers,
        },
      }).catch(handleHttpError);
    },
    [handleHttpError, headers]
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
        .catch(handleHttpError),
    [handleHttpError, headers, i18n]
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
        .catch(handleHttpError),
    [handleHttpError, headers, i18n]
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
        .catch(handleHttpError),
    [handleHttpError, headers, i18n]
  );

  return { getAll, create, remove, change };
};

export default useApi;
