import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";

type PayXpressLogoProps = {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function PayXpressLogo({
  width = 160,
  height = 48,
  style,
  containerStyle,
}: PayXpressLogoProps) {
  const colorScheme = useColorScheme();

  const logo =
    colorScheme === "dark"
      ? require("@/assets/logo/PayXpress-dark.png")
      : require("@/assets/logo/PayXpress.png");

  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={logo}
        style={[
          {
            width,
            height,
          },
          style,
        ]}
        resizeMode="contain"
        accessibilityLabel="PayXpress"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
