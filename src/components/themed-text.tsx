import {
  Text,
  type TextProps,
  type TextStyle,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";

type ThemedTextType = "default" | "title" | "subtitle" | "small" | "code";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  themeColor?: "text" | "textSecondary";
  type?: ThemedTextType;
};

const typographyStyles: Record<ThemedTextType, TextStyle> = {
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 28,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
  code: {
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 18,
  },
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  themeColor = "text",
  type = "default",
  ...otherProps
}: ThemedTextProps) {
  const { resolvedTheme, theme } = useTheme();

  const color =
    resolvedTheme === "dark"
      ? darkColor ??
      theme.text[
      themeColor === "textSecondary" ? "secondary" : "primary"
      ]
      : lightColor ??
      theme.text[
      themeColor === "textSecondary" ? "secondary" : "primary"
      ];

  return (
    <Text
      style={[
        typographyStyles[type],
        { color },
        style,
      ]}
      {...otherProps}
    />
  );
}