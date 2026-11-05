
import { Text, type TextProps, type TextStyle } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { fonts, typography } from "@/theme";

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

const fontFamilyByWeight: Record<string, string> = {
  "400": fonts.regular,
  "500": fonts.medium,
  "600": fonts.semiBold,
  "700": fonts.bold,
};

export function AppText({
  children,
  variant = "body",
  color = "primary",
  align = "left",
  style,
  ...props
}: AppTextProps) {
  const { theme } = useTheme();

  const typographyStyle = typography[variant];
  const fontWeight = typographyStyle.fontWeight ?? "400";

  const fontFamily =
    fontFamilyByWeight[String(fontWeight)] ?? fonts.regular;

  return (
    <Text
      {...props}
      style={[
        typographyStyle,
        {
          color: theme.text[color],
          textAlign: align,
          fontFamily,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
