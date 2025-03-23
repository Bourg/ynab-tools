import { Link } from 'react-router';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'YNAB Tools | Login' }];
}

export default function Home() {
  return <Link to="/budget">Start the app</Link>;
}
