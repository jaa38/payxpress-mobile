import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/use-theme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "background" | "backgroundElement" | "backgroundSelected";
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type = "background",
  ...otherProps
}: ThemedViewProps) {
  const { resolvedTheme, theme } = useTheme();

  const backgroundColor =
    resolvedTheme === "dark"
      ? darkColor ??
      (type === "background"
        ? theme.background.primary
        : type === "backgroundElement"
          ? theme.background.surface
          : theme.background.subtle)
      : lightColor ??
      (type === "background"
        ? theme.background.primary
        : type === "backgroundElement"
          ? theme.background.surface
          : theme.background.subtle);

  return (
    <View
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}