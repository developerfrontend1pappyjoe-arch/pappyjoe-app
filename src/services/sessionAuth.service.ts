import { Alert } from "react-native";
import { AxiosInstance } from "axios";

import { navigationRef } from "../navigation/navigationRef";
import { handleLoggedInStatus, removeLoginDetails } from "../redux/actions";
import { persistor, store } from "../redux/store";
import { NavigationList } from "../routes/NavigationList";
import { clearStoreData } from "../utils/commonUtil";

let isSessionExpiryHandled = false;

const AUTH_URL_FRAGMENTS = [
  "/login",
  "/register",
  "/verify_otp",
  "/reset_password",
];

function isAuthEndpoint(url?: string): boolean {
  if (!url) {
    return false;
  }
  return AUTH_URL_FRAGMENTS.some((fragment) => url.includes(fragment));
}

export function shouldHandleUnauthorized(
  status?: number,
  url?: string
): boolean {
  if (status !== 401 && status !== 403) {
    return false;
  }
  if (isAuthEndpoint(url)) {
    return false;
  }
  const token = (store.getState() as { loginData?: { Authorization_Bearer?: string } })
    ?.loginData?.Authorization_Bearer;
  return Boolean(token);
}

export function handleSessionExpired(): void {
  if (isSessionExpiryHandled) {
    return;
  }
  isSessionExpiryHandled = true;

  Alert.alert(
    "Session Expired",
    "Your session has expired. Please log in again.",
    [
      {
        text: "OK",
        onPress: () => {
          void performSessionLogout();
        },
      },
    ],
    { cancelable: false }
  );
}

export async function performSessionLogout(): Promise<void> {
  try {
    store.dispatch(removeLoginDetails());
    store.dispatch(handleLoggedInStatus(false));
    await clearStoreData("loginData");
    await persistor.purge();

    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: NavigationList.login }],
      });
    }
  } finally {
    isSessionExpiryHandled = false;
  }
}

export function attachUnauthorizedInterceptor(
  axiosInstance: AxiosInstance
): void {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const url = error?.config?.url as string | undefined;

      if (shouldHandleUnauthorized(status, url)) {
        handleSessionExpired();
      }

      return Promise.reject(error);
    }
  );
}
