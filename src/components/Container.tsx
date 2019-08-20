import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';

type Props = {
  children: React.ReactChild
}

const Container = (props: Props) => {
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        {props.children}
      </SafeAreaView>
    </Fragment>
  );
};

export default Container;
