import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/login/response": {};
  "/budget": {};
  "/budget/:budgetId": {
    "budgetId": string;
  };
};