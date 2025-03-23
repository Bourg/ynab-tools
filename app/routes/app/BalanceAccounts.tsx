import api from '~/api';
import type { Route } from './+types/BalanceAccounts';
import { useCurrency } from '~/hooks/useCurrency';

export async function clientLoader({
  params: { budgetId },
}: Route.ClientLoaderArgs) {
  const [settings, accounts, categories] = await Promise.all([
    api().budgets.getBudgetSettingsById(budgetId),
    api().accounts.getAccounts(budgetId),
    api().categories.getCategories(budgetId),
  ]);

  return {
    settings: settings.data.settings,
    accounts: accounts.data.accounts,
    categoryGroups: categories.data.category_groups,
  };
}

export default function BalanceAccounts({
  loaderData: { settings, accounts, categoryGroups },
}: Route.ComponentProps) {
  const currency = useCurrency(settings.currency_format);

  return (
    <>
      <h2>Accounts</h2>
      <ul>
        {accounts.map((account) => (
          <li>
            {account.name} - {currency(account.balance)} ({account.type})
          </li>
        ))}
      </ul>
      <h2>Categories</h2>
      {categoryGroups.map((group) => (
        <>
          <h3>{group.name}</h3>
          <ul>
            {group.categories.map((category) => (
              <li>
                {category.name} - {currency(category.balance)}
              </li>
            ))}
          </ul>
        </>
      ))}
    </>
  );
}
