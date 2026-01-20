import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type React from "react";

export type ActionContext = {
  generatorRef?: React.RefObject<HTMLDivElement | null>;
  router?: AppRouterInstance;
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

  go_to_pricing: ({ router }: ActionContext) => {
    router?.push("/pricing");
  },
} as const;

export type ActionKey = keyof typeof actions;
