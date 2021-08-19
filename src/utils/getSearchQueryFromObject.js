function getSearchQueryFromObject(obj) {
  let result = "";

  for (let key in obj) {
    if (obj[key] || obj[key] === 0) {
      result += `&${key}=${encodeURIComponent(obj[key])}`;
    }
  }

  result = result.replace("&", "?");

  return result;
}

export default getSearchQueryFromObject;
