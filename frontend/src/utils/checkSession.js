import Cookies from "js-cookie";

const BASE_URL = "http://localhost:6543";

const AUTH_COOKIE_NAME = "wearspace_auth";
const USER_DATA_COOKIE_NAME = "wearspace_user_data";

export async function checkSession() {
  try {
    const authCookie = Cookies.get(AUTH_COOKIE_NAME);
    const userDataString = Cookies.get(USER_DATA_COOKIE_NAME);

    if (userDataString) {
      try {
        const storedUser = JSON.parse(userDataString);
        if (authCookie && storedUser.id) {
          return storedUser;
        }
      } catch (e) {
        console.error("Failed to parse stored user data or invalid format:", e);
        Cookies.remove(USER_DATA_COOKIE_NAME);
      }
    }

    if (authCookie) {
      const userId = authCookie;
      try {
        const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const fetchedUser = await response.json();
          Cookies.set(USER_DATA_COOKIE_NAME, JSON.stringify(fetchedUser), {
            expires: 7,
          });
          return fetchedUser;
        } else {
          console.warn(
            "Backend session check failed, response not OK:",
            response.status
          );
          Cookies.remove(AUTH_COOKIE_NAME);
          Cookies.remove(USER_DATA_COOKIE_NAME);
          return null;
        }
      } catch (networkError) {
        console.error(
          "Network or API error during session check:",
          networkError
        );
        return null;
      }
    }

    return null;
  } catch (globalError) {
    console.error("Unexpected error during checkSession:", globalError);
    Cookies.remove(AUTH_COOKIE_NAME);
    Cookies.remove(USER_DATA_COOKIE_NAME);
    return null;
  }
}

export function clearSessionCookies() {
  Cookies.remove(AUTH_COOKIE_NAME);
  Cookies.remove(USER_DATA_COOKIE_NAME);
}
