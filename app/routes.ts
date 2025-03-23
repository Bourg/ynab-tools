import {
  type RouteConfig,
  index,
  route,
  layout,
} from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('login/response', 'auth/LoginResponse.tsx'),
  layout('./auth/AuthorizedRoute.tsx', [
    route('budget', 'routes/app/SelectBudget.tsx'),
    route('budget/:budgetId', 'routes/app/BalanceAccounts.tsx'),
  ]),
] satisfies RouteConfig;
