import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { colors, radius, spacing } from "@/theme";

type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  image: number;
};

const SLIDES: OnboardingSlide[] = [
  {
    id: "easy",
    title: "Easy",
    description:
      "Enjoy seamless access to our multiple products by signing up just once.",
    image: require("@/assets/onboarding/easy.png"),
  },
  {
    id: "fast",
    title: "Fast",
    description: "Buy airtime and pay for subscription all on one platform.",
    image: require("@/assets/onboarding/fast.png"),
  },
  {
    id: "secure",
    title: "Secure",
    description:
      "Easy, fast and secure way to make and receive payments anywhere.",
    image: require("@/assets/onboarding/secure.png"),
  },
];

const SLIDE_DURATION = 700;
const SLIDE_DELAY = 2800;

export default function WelcomeScreen() {
  const { width, height } = useWindowDimensions();

  const translateX = useRef(new Animated.Value(0)).current;

  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const isSmallScreen = height < 750;

  useEffect(() => {
    let mounted = true;
    let timeout: ReturnType<typeof setTimeout>;

    const animateToNextSlide = () => {
      if (!mounted) {
        return;
      }

      const nextIndex =
        currentIndex === SLIDES.length - 1 ? 0 : currentIndex + 1;

      animationRef.current = Animated.timing(translateX, {
        toValue: -(nextIndex * width),
        duration: SLIDE_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });

      animationRef.current.start(({ finished }) => {
        if (!finished || !mounted) {
          return;
        }

        setCurrentIndex(nextIndex);

        if (nextIndex === 0) {
          translateX.setValue(0);
        }

        timeout = setTimeout(animateToNextSlide, SLIDE_DELAY);
      });
    };

    timeout = setTimeout(animateToNextSlide, SLIDE_DELAY);

    return () => {
      mounted = false;

      clearTimeout(timeout);

      animationRef.current?.stop();

      translateX.stopAnimation();
    };
  }, [currentIndex, translateX, width]);

  useEffect(() => {
    translateX.setValue(-(currentIndex * width));
  }, [width]);

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{
        flex: 1,
        backgroundColor: colors.neutral.white,
      }}
    >
      {/* Progress indicators */}
      <View
        style={{
          flexDirection: "row",
          gap: spacing.md,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
        }}
      >
        {SLIDES.map((slide, index) => (
          <View
            key={slide.id}
            style={{
              flex: 1,
              height: 5,
              borderRadius: radius.full,
              backgroundColor:
                index <= currentIndex ? colors.primary[500] : colors.gray[300],
            }}
          />
        ))}
      </View>

      {/* PayXpress logo */}
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: spacing.md,
        }}
      >
        <Image
          source={require("@/assets/logo/PayXpress.png")}
          resizeMode="contain"
          accessibilityLabel="PayXpress"
          style={{
            width: 190,
            height: 75,
          }}
        />
      </View>

      {/* Animated onboarding carousel */}
      <View
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            flexDirection: "row",
            width: width * SLIDES.length,
            height: "100%",
            transform: [
              {
                translateX,
              },
            ],
          }}
        >
          {SLIDES.map((slide) => (
            <View
              key={slide.id}
              style={{
                width,
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: spacing.xl,
              }}
            >
              {/* Illustration */}
              <Image
                source={slide.image}
                resizeMode="contain"
                accessibilityLabel={`${slide.title} PayXpress illustration`}
                style={{
                  width: width - spacing.xl * 2,
                  height: isSmallScreen ? height * 0.34 : height * 0.39,
                }}
              />

              {/* Slide content */}
              <View
                style={{
                  alignItems: "center",
                  marginTop: spacing.md,
                }}
              >
                <AppText
                  variant="displayLarge"
                  color="heading"
                  align="center"
                  style={{
                    fontWeight: "700",
                  }}
                >
                  {slide.title}
                </AppText>

                <AppText variant="bodyLarge" color="muted" align="center">
                  {slide.description}
                </AppText>
              </View>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Login / Register */}
      <View
        style={{
          flexDirection: "row",
          gap: spacing.md,
          paddingHorizontal: spacing.lg,
          marginTop: spacing.md,
        }}
      >
        <Button
          title="Login"
          size="large"
          style={{
            flex: 1,
          }}
          onPress={() => router.push("/login")}
        />

        <Button
          title="Register"
          variant="tertiary"
          size="large"
          style={{
            flex: 1,
          }}
          onPress={() => router.push("/register")}
        />
      </View>

      {/* CBN licensing */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
        }}
      >
        <Image
          source={require("@/assets/onboarding/cbn-logo.png")}
          resizeMode="contain"
          accessibilityLabel="Central Bank of Nigeria"
          style={{
            width: 42,
            height: 48,
            marginRight: spacing.sm,
          }}
        />

        <AppText
          variant="bodySmall"
          color="muted"
          style={{
            flexShrink: 1,
          }}
        >
          Licensed by the{" "}
          <AppText variant="bodySmallBold" color="muted">
            Central Bank of Nigeria
          </AppText>
        </AppText>
      </View>
    </SafeAreaView>
  );
}
