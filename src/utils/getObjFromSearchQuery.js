const getObjFromSearchQuery = (queryString = "") => {
  const accumulator = {};
  const searchParams = new URLSearchParams(queryString);

  for (const [key, value] of searchParams) {
    accumulator[key] = value || true;
  }

  return accumulator;
};

export default getObjFromSearchQuery;
