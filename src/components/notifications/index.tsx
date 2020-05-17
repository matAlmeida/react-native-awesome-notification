import React, { useState, useEffect, useRef } from 'react';
import { Animated, Dimensions, ViewStyle, TextStyle } from 'react-native';
import styled from 'styled-components/native';
import {
  PanGestureHandler,
  State,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import {
  sendUp,
  sendDown,
  sendOutScreenRight,
  springBackAnimation,
} from '../animations';

const Container = styled(Animated.View)`
  width: 90%;
  padding: 20px;
  background-color: blueviolet;
  border-radius: 5px;
  align-items: center;
`;

const Text = styled.Text`
  color: #fff;
`;

type NotificationProp = {
  text?: string;
  visible?: boolean;
  onClose?: (value?: any) => any;
  duration?: number;
  children?: React.ReactChildren;
  topOffset?: number;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
};

const SCREEN_WIDTH = Dimensions.get('screen').width;

function Notification({
  text,
  visible = true,
  onClose,
  duration = 2500,
  children,
  topOffset = 40,
  containerStyle = {},
  textStyle = {},
}: NotificationProp) {
  const [translationY] = useState(() => new Animated.Value(0));
  const [translationX] = useState(() => new Animated.Value(0));
  const [velocityX] = useState(() => new Animated.Value(0));

  const [isVisible, setVisible] = useState(visible);

  const timeoutRef = useRef<number>();

  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX, velocityX } }],
    {
      useNativeDriver: false,
    },
  );

  useEffect(() => {
    setVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (isVisible) {
      translationX.setValue(0);
      sendDown(translationY).start();
      createDurationTimeout();
    } else {
      sendUp(translationY).start();
    }
  }, [isVisible]);

  const createDurationTimeout = () => {
    if (duration) {
      const id = setTimeout(() => {
        sendUp(translationY).start(() => {
          setVisible(false);
          if (onClose) {
            onClose();
          }
        });
      }, duration);

      timeoutRef.current = id;
    }
  };

  const cleanDurationTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleStateChange = ({
    nativeEvent,
  }: PanGestureHandlerGestureEvent) => {
    if (nativeEvent.state === State.END) {
      const swipeSize = translationX.__getValue();
      const swipeVelocity = velocityX.__getValue();

      if (swipeSize > SCREEN_WIDTH / 2 || swipeVelocity > 1000) {
        cleanDurationTimeout();
        sendOutScreenRight(translationX).start(() => {
          if (onClose) {
            onClose();
          }
        });
      } else {
        createDurationTimeout();
        springBackAnimation(translationX).start();
      }
    } else if (nativeEvent.state === State.ACTIVE) {
      cleanDurationTimeout();
    }
  };

  const swipeTranslation = {
    translateY: translationY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, topOffset],
    }),
    translateX: translationX.interpolate({
      inputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
      outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
    }),
  };

  return isVisible ? (
    <PanGestureHandler
      onGestureEvent={onPanGestureEvent}
      onHandlerStateChange={handleStateChange}>
      <Container style={{ ...containerStyle, ...swipeTranslation }}>
        {text ? <Text style={{ ...textStyle }}>{text}</Text> : children}
      </Container>
    </PanGestureHandler>
  ) : null;
}

export default Notification;
