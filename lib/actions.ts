import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { startTrial, getMonthlyPro } from "./stripe-service";
import type React from "react";

export type ActionContext = {
  generatorRef?: React.RefObject<HTMLDivElement | null>;
  router?: AppRouterInstance;
  setLoading?: (loading: boolean) => void;
};

export const actions = {
  scroll_to_generator: ({ generatorRef }: ActionContext) => {
    generatorRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  },

  go_to_login: ({ router }: ActionContext) => {
    router?.push("/auth?mode=login");
  },
  go_to_generator: ({ router }: ActionContext) => {
    router?.push("/generator");
  },

  go_to_pricing: ({ router }: ActionContext) => {
    router?.push("/pricing");
  },

  start_trial: async ({ router,setLoading }: ActionContext) => {
    try {
      setLoading?.(true);
      await startTrial();
      // Redirect to generator or dashboard after successful trial activation
      router?.push("/generator");
    } catch (error) {
      // Errors are already logged in firebase-functions.ts
      // You could add a toast notification call here
    } finally {
      setLoading?.(false);
    }
  },

  /**
   * Initiates the Stripe Checkout process for the Pro plan.
   */
  get_monthly_pro: async ({ setLoading }: ActionContext) => {
    try {
      setLoading?.(true);
      await getMonthlyPro();
      // Note: getMonthlyPro handles the window.location.href redirect internally
    } catch (error) {
      // Error handling logic
    } finally {
      setLoading?.(false);
    }
  },
} as const;

export type ActionKey = keyof typeof actions;
