import { Animated, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('screen').width;

export const sendOutScreenRight = (animatedValue: Animated.Value) =>
  Animated.spring(animatedValue, {
    toValue: SCREEN_WIDTH * 1.5,
    useNativeDriver: true,
  });

export const springBackAnimation = (animatedValue: Animated.Value) =>
  Animated.spring(animatedValue, {
    toValue: 0,
    useNativeDriver: true,
  });

export const sendUp = (animatedValue: Animated.Value) =>
  Animated.timing(animatedValue, {
    toValue: -1,
    duration: 150,
    useNativeDriver: true,
  });

export const sendDown = (animatedValue: Animated.Value) =>
  Animated.timing(animatedValue, {
    toValue: 1,
    duration: 150,
    useNativeDriver: true,
  });
