import React, { useState, useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
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
  flex-direction: row;
  position: absolute;
  top: 0;
  flex: 1;
`;

const Text = styled.Text``;

type NotificationsProp = {
  text: string;
  visible: boolean;
  onClose?: (value?: any) => any;
  duration?: number;
};

const SCREEN_WIDTH = Dimensions.get('screen').width;

function Notifications({
  text,
  visible,
  onClose,
  duration = 2500,
}: NotificationsProp) {
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

      if (duration) {
        createDurationTimeout();
      }
    } else {
      sendUp(translationY).start();
    }
  }, [isVisible]);

  const createDurationTimeout = () => {
    const id = setTimeout(() => {
      sendUp(translationY).start(() => {
        setVisible(false);
        if (onClose) {
          onClose();
        }
      });
    }, duration);

    timeoutRef.current = id;
  };

  const handleStateChange = ({
    nativeEvent,
  }: PanGestureHandlerGestureEvent) => {
    if (nativeEvent.state === State.END) {
      const swipeSize = translationX.__getValue();
      const swipeVelocity = velocityX.__getValue();

      if (swipeSize > SCREEN_WIDTH / 2 || swipeVelocity > 1000) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        sendOutScreenRight(translationX).start(() => {
          translationX.setValue(0);
          if (onClose) {
            onClose();
          }
        });
      } else {
        createDurationTimeout();
        springBackAnimation(translationX).start();
      }
    } else if (nativeEvent.state === State.ACTIVE) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const swipeTranslation = {
    translateY: translationY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 50],
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
      <Container style={swipeTranslation}>
        <Text>{text}</Text>
      </Container>
    </PanGestureHandler>
  ) : null;
}

export default Notifications;
