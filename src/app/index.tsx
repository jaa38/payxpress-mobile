import { Redirect } from "expo-router";

import { useAuthStore } from "@/store/auth-store";

export default function IndexRoute() {
    const isHydrating = useAuthStore((state) => state.isHydrating);
    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated,
    );

    if (isHydrating) {
        return null;
    }

    return (
        <Redirect href={isAuthenticated ? "/(tabs)" : "/welcome"} />
    );
}