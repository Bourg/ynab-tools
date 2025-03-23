import { Link } from 'react-router';
import type { BudgetSummary } from 'ynab';
import api from '~/api';
import type { Route } from './+types/index';

export async function clientLoader() {
  const budgets = await api().budgets.getBudgets();
  return budgets.data;
}

export default function YnabApp({ loaderData }: Route.ComponentProps) {
  return (
    <>
      {loaderData.default_budget == null ? null : (
        <p>
          The default budget is{' '}
          <BudgetLink budget={loaderData.default_budget} />
        </p>
      )}
      <ul>
        {loaderData.budgets.map((budget) => (
          <li>
            <BudgetLink budget={budget} />
          </li>
        ))}
      </ul>
    </>
  );
}

function BudgetLink({ budget }: { budget: BudgetSummary }) {
  return <Link to={budget.id}>{budget.name}</Link>;
}
