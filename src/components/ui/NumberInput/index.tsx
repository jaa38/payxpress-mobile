
import { forwardRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  type TextStyle,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { radius } from "@/theme";
import { typography } from "@/theme/typography";

type InputState = "default" | "focus" | "error" | "disabled";

interface NumberInputProps extends Omit<TextInputProps, "onChangeText"> {
  value: string;
  onChangeText: (value: string) => void;
  error?: boolean;
}

export const NumberInput = forwardRef<TextInput, NumberInputProps>(
  (
    {
      value,
      onChangeText,
      error = false,
      editable = true,
      onFocus,
      onBlur,
      style,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const [focused, setFocused] = useState(false);

    const state: InputState = !editable
      ? "disabled"
      : error
        ? "error"
        : focused
          ? "focus"
          : "default";

    return (
      <TextInput
        ref={ref}
        {...props}
        value={value}
        editable={editable}
        keyboardType="number-pad"
        maxLength={1}
        textAlign="center"
        placeholder="-"
        placeholderTextColor={theme.input.placeholder}
        onChangeText={onChangeText}
        style={[
          styles.input,
          {
            color: theme.input.text,
          },
          getInputStateStyle(state, theme),
          style,
        ]}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
      />
    );
  },
);

NumberInput.displayName = "NumberInput";

function getInputStateStyle(
  state: InputState,
  theme: ReturnType<typeof useTheme>["theme"],
): TextStyle {
  switch (state) {
    case "focus":
      return {
        borderColor: theme.input.focusBorder,
        backgroundColor: theme.input.background,
      };

    case "error":
      return {
        borderColor: theme.input.errorBorder,
        backgroundColor: theme.input.background,
      };

    case "disabled":
      return {
        borderColor: theme.input.border,
        backgroundColor: theme.input.disabledBackground,
      };

    default:
      return {
        borderColor: theme.input.border,
        backgroundColor: theme.input.background,
      };
  }
}

const styles = StyleSheet.create({
  input: {
    width: 42,
    height: 48,
    borderWidth: 1,
    borderRadius: radius.md,
    textAlign: "center",
    ...typography.body,
  },
});
