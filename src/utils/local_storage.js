const lcAvailable = typeof localStorage !== "undefined";

const local_storage = {
  set: (key, data) => {
    if (lcAvailable) {
      if (typeof data === "object") {
        data = JSON.stringify(data);
      }

      localStorage.setItem(key, data);
    }
  },
  get: key => {
    let result = false;

    if (lcAvailable) {
      try {
        result = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        result = localStorage.getItem(key);
      }
    }

    return result || false;
  },
  remove: key => {
    if (lcAvailable) {
      if (Array.isArray(key)) {
        key.forEach(k => localStorage.removeItem(k));
      } else {
        localStorage.removeItem(key);
      }
    }
  },
};

export default local_storage;
