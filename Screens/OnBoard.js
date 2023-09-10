import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import OnBoardSlider from '../Components/OnBoardSlider';

const OnBoard = () => {
  console.log('shit');

  return (
    <>
      <OnBoardSlider />
    </>
  );
};

export default OnBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 1000,
    height: 1000,
    backgroundColor: '#131417',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    paddingVertical: 30,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
});
