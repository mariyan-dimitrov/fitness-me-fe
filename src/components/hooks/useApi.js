import { useCallback, useMemo } from "react";
import axios from "axios";

import { useCookieContext } from "../contexts/CookieContext";
import hostURL from "../../_constants/serverApiUrl";
import session_storage from "../../utils/session_storage";

const useApi = () => {
  const { cookies } = useCookieContext();
  const token = session_storage.get("userToken") || cookies.userToken;

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const getAll = useCallback(
    assetType =>
      axios({
        method: "GET",
        url: `${hostURL}/${assetType}`,
        headers: {
          ...headers,
        },
      }),
    [headers]
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
      }),
    [headers]
  );

  const remove = useCallback(
    (assetType, assetId) =>
      axios({
        method: "DELETE",
        url: `${hostURL}/${assetType}/${assetId}`,
        headers: {
          ...headers,
        },
      }),
    [headers]
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
      }),
    [headers]
  );

  return { getAll, create, remove, change };
};

export default useApi;
