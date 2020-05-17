import React, { useState } from 'react';
import styled from 'styled-components/native';

import Notifications from './components/notifications';

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

const App = () => {
  const [visible, setVisible] = useState(false);

  const handleToogle = () => {
    setVisible(!visible);
  };

  return (
    <>
      <Container>
        <Notifications
          text={'OH MY MINE'}
          visible={visible}
          onClose={() => setVisible(false)}
        />
        <Text>Oi</Text>
        <ToogleButton onPress={handleToogle} title="toggle" />
      </Container>
    </>
  );
};

export default App;
