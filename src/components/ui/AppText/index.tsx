import { Text, TextProps, TextStyle } from "react-native";

import { fonts, theme, typography } from "@/theme";

type Variant =
  | "displayLarge"
  | "h1"
  | "h2"
  | "h3"
  | "navigationTitle"
  | "bodyLarge"
  | "bodyLargeBold"
  | "body"
  | "bodyBold"
  | "bodySmall"
  | "bodySmallBold"
  | "labelLarge"
  | "label"
  | "labelSmall"
  | "buttonLarge"
  | "button"
  | "buttonSmall"
  | "caption"
  | "overline"
  | "uiCardTitle"
  | "placeholder";

export type Color =
  | "primary"
  | "heading"
  | "strong"
  | "secondary"
  | "label"
  | "muted"
  | "placeholder"
  | "inverse"
  | "brand"
  | "accent"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "link";

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: Color;
  align?: TextStyle["textAlign"];
}

export function AppText({
  children,
  variant = "body",
  color = "primary",
  align = "left",
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        typography[variant],
        {
          color: theme.text[color],
          textAlign: align,
          fontFamily: fonts.primary,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}