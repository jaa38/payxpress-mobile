
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import CountryPicker, {
  type Country,
} from "react-native-country-picker-modal";

import { AppText } from "@/components/ui/AppText";
import { useTheme } from "@/hooks/use-theme";
import { radius } from "@/theme";

interface PhoneNumberInputProps {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  countryCode: string;
  onCountryCodeChange: (countryCode: string) => void;
  error?: string;
}

export function PhoneNumberInput({
  label,
  value,
  onChangeText,
  countryCode,
  onCountryCodeChange,
  error,
}: PhoneNumberInputProps) {
  const { theme } = useTheme();

  const [countryPickerVisible, setCountryPickerVisible] = useState(false);

  const [country, setCountry] = useState<Country>({
    cca2: "NG",
    callingCode: ["234"],
    flag: "🇳🇬",
  } as Country);

  function handleCountrySelect(selectedCountry: Country) {
    setCountry(selectedCountry);
    onCountryCodeChange(selectedCountry.cca2);
    setCountryPickerVisible(false);
  }

  return (
    <View>
      {label && (
        <AppText
          variant="caption"
          color="secondary"
          style={{
            marginBottom: 8,
          }}
        >
          {label}
        </AppText>
      )}

      <View style={styles.container}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Country calling code +${country.callingCode[0]}`}
          style={[
            styles.countryPicker,
            {
              borderColor: theme.input.border,
              backgroundColor: theme.input.background,
            },
          ]}
          onPress={() => setCountryPickerVisible(true)}
        >
          <CountryPicker
            visible={countryPickerVisible}
            withFilter
            withFlag
            withCallingCode
            withEmoji
            countryCode={countryCode as Country["cca2"]}
            onSelect={handleCountrySelect}
            onClose={() => setCountryPickerVisible(false)}
          />

          <AppText variant="body" color="primary">
            +{country.callingCode[0]}
          </AppText>
        </Pressable>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          placeholder="8012345678"
          placeholderTextColor={theme.input.placeholder}
          style={[
            styles.input,
            {
              borderColor: error
                ? theme.input.errorBorder
                : theme.input.border,
              backgroundColor: theme.input.background,
              color: theme.input.text,
            },
          ]}
        />
      </View>

      {error && (
        <AppText
          variant="caption"
          color="error"
          style={{
            marginTop: 4,
          }}
        >
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },

  countryPicker: {
    width: 110,
    height: 48,
    borderWidth: 1,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 16,
  },
});
