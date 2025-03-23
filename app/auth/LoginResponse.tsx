import type { Route } from './+types/LoginResponse';
import { popRoute, setAccessToken } from '~/auth/index';
import { redirect } from 'react-router';

export function clientLoader() {
  const hash = window.location.hash;

  const params = new URLSearchParams(hash.substring(1));
  const accessToken = params.get('access_token');

  if (accessToken == null) {
    throw new Error('Access token not found');
  }

  setAccessToken(accessToken);

  return redirect(popRoute() ?? '/');
}

export default function LoginResponse({ loaderData }: Route.ComponentProps) {
  return <p>Logging in... {loaderData}</p>;
}
