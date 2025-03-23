const accessTokenStorageKey = 'ynab-app-access-token';
const routeStorageKey = 'route-storage-key';

export interface Auth {
  accessToken: any;
}

export type AuthListener = (auth: Auth) => void;

let currentAuth: Auth | null = null;
let attemptedToRestoreAuth = false;

const authListeners: AuthListener[] = [
  (auth) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        accessTokenStorageKey,
        JSON.stringify(auth.accessToken),
      );
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

    const accessToken = JSON.parse(storedAccessToken);
    currentAuth = { accessToken };
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

export function setAuth(accessToken: any) {
  authListeners.forEach((listener) => listener(accessToken));
}

export function saveRoute(route: string) {
  window.localStorage.setItem(route, route);
}

export function popRoute() {
  const route = localStorage.getItem(routeStorageKey);
  localStorage.removeItem(routeStorageKey);
  return route;
}
