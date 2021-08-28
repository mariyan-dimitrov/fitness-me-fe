const session_storage = {
  set: (key, data) => {
    if (typeof data === "object") {
      data = JSON.stringify(data);
    }

    sessionStorage.setItem(key, data);
  },
  get: key => {
    let result = false;

    try {
      result = JSON.parse(sessionStorage.getItem(key));
    } catch (e) {
      result = sessionStorage.getItem(key);
    }

    return result || false;
  },
  remove: key => {
    if (Array.isArray(key)) {
      key.forEach(k => sessionStorage.removeItem(k));
    } else {
      sessionStorage.removeItem(key);
    }
  },
};

export default session_storage;
