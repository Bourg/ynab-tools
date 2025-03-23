const accessTokenStorageKey = 'ynab-app-access-token';
const routeStorageKey = 'route-storage-key';

export interface Auth {
  accessToken: string;
}

export type AuthListener = (auth: Auth) => void;

let currentAuth: Auth | null = null;
let attemptedToRestoreAuth = false;

const authListeners: AuthListener[] = [
  (auth) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(accessTokenStorageKey, auth.accessToken);
    }
  },
];

export function getAuth(): Auth | null {
  if (
    currentAuth == null &&
    !attemptedToRestoreAuth &&
    typeof localStorage !== 'undefined'
  ) {
    attemptedToRestoreAuth = true;

    const storedAccessToken = localStorage.getItem(accessTokenStorageKey);
    if (storedAccessToken == null) {
      return null;
    }

    currentAuth = { accessToken: storedAccessToken };
  }

  return currentAuth;
}

export function addListener(listener: AuthListener) {
  authListeners.push(listener);

  const currentAuth = getAuth();
  if (currentAuth != null) {
    listener(currentAuth);
  }
}

export function setAccessToken(accessToken: string) {
  const auth = { accessToken };

  authListeners.forEach((listener) => listener(auth));

  currentAuth = auth;
}

export function saveRoute(route: string) {
  window.localStorage.setItem(routeStorageKey, route);
}

export function popRoute() {
  const route = localStorage.getItem(routeStorageKey);
  localStorage.removeItem(routeStorageKey);
  return route;
}
