import { useRef } from "react";

import {
  TextInput,
  View,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";

import { NumberInput } from "@/components/ui/NumberInput";

import { spacing } from "@/theme";


interface OTPInputProps {
  length?: number;

  value?: string;

  onChange?: (code: string) => void;

  onComplete?: (code: string) => void;
}

export function OTPInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
}: OTPInputProps) {
  const refs = useRef<TextInput[]>([]);

  const digits = value
    .replace(/\D/g, "")
    .slice(0, length)
    .split("");

  const otp = [
    ...digits,
    ...Array(Math.max(length - digits.length, 0)).fill(""),
  ];

  function updateOtp(nextOtp: string[]) {
    const code = nextOtp.join("");

    onChange?.(code);

    if (
      nextOtp.length === length &&
      nextOtp.every((digit) => digit !== "")
    ) {
      onComplete?.(code);
    }
  }

  function handleChange(text: string, index: number) {
    const sanitizedText = text.replace(/\D/g, "");

    /*
     * Paste support
     */
    if (sanitizedText.length > 1) {
      const pastedDigits = sanitizedText
        .slice(0, length)
        .split("");

      const nextOtp = Array(length).fill("");

      pastedDigits.forEach((digit, digitIndex) => {
        nextOtp[digitIndex] = digit;
      });

      updateOtp(nextOtp);

      const lastFilledIndex = Math.min(
        pastedDigits.length,
        length
      ) - 1;

      if (lastFilledIndex >= 0) {
        refs.current[lastFilledIndex]?.focus();
      }

      return;
    }

    /*
     * Single digit entry
     */
    const nextOtp = [...otp];

    nextOtp[index] = sanitizedText;

    updateOtp(nextOtp);

    if (sanitizedText && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) {
    const { key } = event.nativeEvent;

    if (key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: spacing.sm,
      }}
    >
      {otp.map((digit, index) => (
        <NumberInput
          key={index}
          ref={(ref) => {
            if (ref) {
              refs.current[index] = ref;
            }
          }}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
        />
      ))}
    </View>
  );
}
