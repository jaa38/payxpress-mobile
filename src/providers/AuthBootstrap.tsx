import { useEffect, type ReactNode } from "react";

import { hydrateAuth } from "@/services/auth/auth-hydration";

interface AuthBootstrapProps {
  children: ReactNode;
}

export function AuthBootstrap({ children }: AuthBootstrapProps) {
  useEffect(() => {
    void hydrateAuth();
  }, []);

  return children;
}
