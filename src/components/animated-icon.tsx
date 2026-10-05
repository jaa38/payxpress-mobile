import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { Easing, Keyframe } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { colors } from "@/theme/colors";

const INITIAL_SCALE_FACTOR = Dimensions.get("screen").height / 90;
const DURATION = 2500;

export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  const splashKeyframe = new Keyframe({
    0: {
      transform: [{ scale: 1 }],
      opacity: 1,
    },
    20: {
      opacity: 1,
    },
    70: {
      opacity: 0,
      easing: Easing.elastic(0.7),
    },
    100: {
      opacity: 0,
      transform: [{ scale: 1 }],
      easing: Easing.elastic(0.7),
    },
  });

  const logo = (
    <View style={styles.logoContainer}>
      <Image
        style={styles.logo}
        source={require("@/assets/logo/PayXpress.png")}
        contentFit="contain"
      />
    </View>
  );

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        "worklet";

        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={styles.splashOverlay}
    >
      {logo}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={styles.splashOverlay}
    >
      {logo}
    </View>
  );
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: INITIAL_SCALE_FACTOR }],
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
  },
  40: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
    easing: Easing.elastic(0.7),
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: "0deg" }],
  },
  100: {
    transform: [{ rotateZ: "7200deg" }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View
        entering={glowKeyframe.duration(60 * 1000 * 4)}
        style={styles.glow}
      >
        <Image
          style={styles.glow}
          source={require("@/assets/images/logo-glow.png")}
        />
      </Animated.View>

      <Animated.View
        entering={keyframe.duration(DURATION)}
        style={styles.background}
      />

      <Animated.View
        style={styles.imageContainer}
        entering={logoKeyframe.duration(DURATION)}
      >
        <Image
          style={styles.image}
          source={require("@/assets/images/expo-logo.png")}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  glow: {
    width: 201,
    height: 201,
    position: "absolute",
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 128,
    height: 128,
    zIndex: 100,
  },

  image: {
    width: 76,
    height: 71,
  },

  background: {
    borderRadius: 40,
    experimental_backgroundImage: `linear-gradient(180deg, ${colors.primary[400]}, ${colors.primary[600]})`,
    width: 128,
    height: 128,
    position: "absolute",
  },

  logoContainer: {
    width: 300,
    height: 150,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  logo: {
    width: 240,
    height: 120,
  },
});
