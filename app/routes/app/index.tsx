import api from '~/api';
import type { Route } from './+types/index';

export async function clientLoader() {
  const budgets = await api().budgets.getBudgets();
  return budgets.data;
}

export default function YnabApp({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <p>This is the app</p>
      <p>The default budget is {loaderData.default_budget?.name}</p>
      <ul>
        {loaderData.budgets.map((budget) => (
          <li>{budget.name}</li>
        ))}
      </ul>
    </>
  );
}
