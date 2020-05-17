import React, { useState } from 'react';
import styled from 'styled-components/native';

import Notification from './components/notification';

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text`
  font-weight: bold;
  font-size: 24px;
`;

const ToogleButton = styled.Button``;

const NotificationContainer = styled.View`
  flex: 1;
  position: absolute;
  top: 0;
  width: 100%;
  align-items: center;
`;

const App = () => {
  const [visible, setVisible] = useState(false);

  const handleToogle = () => {
    setVisible(!visible);
  };

  return (
    <>
      <Container>
        <Text>Oi</Text>
        <ToogleButton onPress={handleToogle} title="toggle" />
        <NotificationContainer>
          <Notification
            text={
              'OH MY MINE OH MY MINE OH MY MINE OH MY MINE OH MY MINE OH MY MINE OH MY MINE OH MY MINE'
            }
            visible={visible}
            onClose={() => setVisible(false)}
          />
        </NotificationContainer>
      </Container>
    </>
  );
};

export default App;
