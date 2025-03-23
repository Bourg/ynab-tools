import { Outlet, redirect, type ClientLoaderFunctionArgs } from 'react-router';
import { getAuth, saveRoute } from '~/auth/index';

const clientId = import.meta.env.VITE_YNAB_CLIENT_ID;
const redirectUri = import.meta.env.VITE_YNAB_REDIRECT_URI;
const authorizeUri = import.meta.env.VITE_YNAB_AUTHORIZE_URI;

export function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const currentAuth = getAuth();
  if (currentAuth == null) {
    saveRoute(request.url);
    return redirectForAuth();
  }
}

export default function AuthorizedRoute() {
  return <Outlet />;
}

function redirectForAuth() {
  const params = new URLSearchParams();
  params.set('client_id', clientId);
  params.set('redirect_uri', redirectUri);
  params.set('response_type', 'token');

  return redirect(`${authorizeUri}?${params.toString()}`);
}
