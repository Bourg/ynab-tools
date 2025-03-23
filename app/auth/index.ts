const accessTokenStorageKey = 'ynab-app-access-token';
const routeStorageKey = 'route-storage-key';

export interface Auth {
  accessToken: any;
}

export function getAuth(): Auth | null {
  const storedAccessToken = localStorage.getItem(accessTokenStorageKey);
  if (storedAccessToken == null) {
    return null;
  }
  const accessToken = JSON.parse(storedAccessToken);

  return { accessToken };
}

export function setAuth(accessToken: any) {
  localStorage.setItem(accessTokenStorageKey, JSON.stringify(accessToken));
}

export function saveRoute(route: string) {
  localStorage.setItem(route, route);
}

export function popRoute() {
  const route = localStorage.getItem(routeStorageKey);
  localStorage.removeItem(routeStorageKey);
  return route;
}
