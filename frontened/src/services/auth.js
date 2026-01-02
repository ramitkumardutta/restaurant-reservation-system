export const loginUser = (data) => {
  return fetch("http://localhost:3000/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const signupUser = (data) => {
  return fetch("http://localhost:3000/api/user/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const setAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  try {
    window.dispatchEvent(new Event("authChanged"));
  } catch (e) {
    // ignore in non-browser/test env
  }
};

export const getUser = () => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user || user === "undefined") return null;

    return JSON.parse(user);
  } catch (err) {
    console.error("Invalid user in localStorage", err);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  try {
    window.dispatchEvent(new Event("authChanged"));
  } catch (e) {
    // ignore in non-browser/test env
  }
};
