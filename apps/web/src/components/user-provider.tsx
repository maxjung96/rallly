import { useTranslation } from "next-i18next";
import posthog from "posthog-js";
import React from "react";
import { useMount } from "react-use";

import { UserSession } from "@/utils/auth";

import { trpc } from "../utils/trpc";
import { useRequiredContext } from "./use-required-context";

export const UserContext = React.createContext<{
  user: UserSession & { shortName: string };
  refresh: () => void;
  isUpdating: boolean;
  logout: () => void;
  ownsObject: (obj: { userId: string | null }) => boolean;
} | null>(null);

export const useUser = () => {
  return useRequiredContext(UserContext, "UserContext");
};

export const useAuthenticatedUser = () => {
  const { user, ...rest } = useRequiredContext(UserContext, "UserContext");
  if (user.isGuest) {
    throw new Error("Forget to prefetch user identity");
  }

  return { user, ...rest };
};

export const IfAuthenticated = (props: { children?: React.ReactNode }) => {
  const { user } = useUser();
  if (user.isGuest) {
    return null;
  }

  return <>{props.children}</>;
};

export const IfGuest = (props: { children?: React.ReactNode }) => {
  const { user } = useUser();
  if (!user.isGuest) {
    return null;
  }

  return <>{props.children}</>;
};

export const UserProvider = (props: {
  children?: React.ReactNode;
  forceUserId?: string;
}) => {
  const { t } = useTranslation("app");

  const queryClient = trpc.useContext();
  const { data: user } = trpc.whoami.get.useQuery();

  const [isUpdating, setIsUpdating] = React.useState(false);

  const logout = trpc.whoami.destroy.useMutation({
    onSuccess: async () => {
      setIsUpdating(true);
      await queryClient.whoami.invalidate();
      setIsUpdating(false);
    },
  });

  useMount(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_API_KEY ?? "fake token", {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_API_HOST,
      opt_out_capturing_by_default: false,
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: false,
      loaded: (posthog) => {
        if (!process.env.NEXT_PUBLIC_POSTHOG_API_KEY) {
          posthog.opt_out_capturing();
        }
        if (user && posthog.get_distinct_id() !== user.id) {
          posthog.identify(
            user.id,
            !user.isGuest
              ? { email: user.email, name: user.name }
              : { name: user.id },
          );
        }
      },
    });
  });

  const shortName = user
    ? user.isGuest === false
      ? user.name
      : user.id.substring(0, 10)
    : t("guest");

  if (!user) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        isUpdating,
        user: { ...user, shortName },
        refresh: () => {
          return queryClient.whoami.invalidate();
        },
        ownsObject: ({ userId }) => {
          if (
            (userId && user.id === userId) ||
            (props.forceUserId && props.forceUserId === userId)
          ) {
            return true;
          }
          return false;
        },
        logout: () => {
          logout.mutate();
        },
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

type ParticipantOrComment = {
  userId: string | null;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const withSession = <P extends {} = {}>(
  component: React.ComponentType<P>,
) => {
  const ComposedComponent: React.FunctionComponent<P> = (props: P) => {
    const Component = component;
    return (
      <UserProvider>
        <Component {...props} />
      </UserProvider>
    );
  };
  ComposedComponent.displayName = `withUser(${component.displayName})`;
  return ComposedComponent;
};

/**
 * @deprecated Stop using this function. All object
 */
export const isUnclaimed = (obj: ParticipantOrComment) => !obj.userId;
