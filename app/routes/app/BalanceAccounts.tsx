import api from '~/api';
import type { Route } from './+types/BalanceAccounts';
import { useCurrency } from '~/hooks/useCurrency';
import {
  type Account,
  AccountType,
  type Category,
  type CategoryGroupWithCategories,
} from 'ynab';
import { useEffect, useMemo, useState } from 'react';

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
  params: { budgetId },
  loaderData: { settings, accounts, categoryGroups },
}: Route.ComponentProps) {
  const currency = useCurrency(settings.currency_format);
  const [state, setState] = useBalancingState(budgetId);

  const potentialDestinations = useMemo(
    () => accounts.filter(isPotentialDestination),
    [accounts],
  );

  const relevantCategories = useMemo(
    () =>
      categoryGroups.flatMap((group) =>
        isGroupRelevant(group)
          ? group.categories.filter(isCategoryRelevant)
          : [],
      ),
    [categoryGroups],
  );

  const undesignatedCategories = relevantCategories.filter(
    (category) => !isDestinationKnown(state, category),
  );

  if (undesignatedCategories.length <= 0) {
    const perfectBalances = Object.fromEntries(
      potentialDestinations.map((d) => [d.id, 0] as [string, number]),
    );

    relevantCategories.forEach(
      (c) =>
        (perfectBalances[state.destinationAccountsByCategory[c.id]] +=
          c.balance),
    );

    return potentialDestinations.map((d) => (
      <dl>
        <dt>{d.name}</dt>
        <dd>{currency(perfectBalances[d.id])}</dd>
      </dl>
    ));
  }

  const nextCategory = undesignatedCategories[0];

  return (
    <>
      <h2>
        Assign Categories to Account ({undesignatedCategories.length} categories
        remaining)
      </h2>
      <p>{nextCategory.name}</p>
      <ul>
        {potentialDestinations.map((account) => (
          <li>
            <button
              onClick={() =>
                setState((prev) => setDestination(prev, nextCategory, account))
              }
            >
              {account.name}
            </button>
          </li>
        ))}
      </ul>

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

interface State {
  destinationAccountsByCategory: Record<string, string>;
}

function isGroupRelevant(group: CategoryGroupWithCategories) {
  return group.name !== 'Internal Master Category';
}

function isCategoryRelevant(category: Category) {
  return !category.hidden && !category.deleted;
}

function isPotentialDestination(account: Account) {
  return (
    account.type === AccountType.Checking ||
    account.type === AccountType.Savings ||
    account.type === AccountType.Cash
  );
}

function isDestinationKnown(state: State, category: Category) {
  return state.destinationAccountsByCategory[category.id] != null;
}

function setDestination(state: State, category: Category, account: Account) {
  return {
    ...state,
    destinationAccountsByCategory: {
      ...state.destinationAccountsByCategory,
      [category.id]: account.id,
    },
  };
}

function useBalancingState(budgetId: string) {
  const ret = useState<State>(() => loadBalancingState(budgetId));
  const [state] = ret;

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey(budgetId), JSON.stringify(state));
    }
  }, [state]);

  return ret;
}

function loadBalancingState(budgetId: string) {
  if (typeof localStorage === 'undefined') {
    return defaultBalancingState();
  }

  try {
    const stored = localStorage.getItem(storageKey(budgetId));
    if (stored == null) {
      return defaultBalancingState();
    }

    return JSON.parse(stored);
  } catch (e) {
    return defaultBalancingState();
  }
}

function storageKey(budgetId: string) {
  return `balancing-budgetId:${budgetId}`;
}

function defaultBalancingState(): State {
  return {
    destinationAccountsByCategory: {},
  };
}
