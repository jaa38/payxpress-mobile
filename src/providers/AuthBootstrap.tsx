import { useEffect, type ReactNode } from "react";

import { hydrateAuth } from "@/services/auth/auth-hydration";

interface AuthBootstrapProps {
  children: ReactNode;
}

export function AuthBootstrap({ children }: AuthBootstrapProps) {
  useEffect(() => {
    void hydrateAuth().catch((error) => {
      console.error("Authentication bootstrap failed:", error);
    });
  }, []);

  return children;
}