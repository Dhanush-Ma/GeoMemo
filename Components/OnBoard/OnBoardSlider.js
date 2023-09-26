import {FlatList, View, Dimensions} from 'react-native';
import onBoardData from './onBoardData';
import OnBoardSliderItem from './OnBoardSliderItem';
import {useState} from 'react';
import data from './onBoardData';

const OnBoardSlider = () => {
  const {width, height} = Dimensions.get('screen');
  const [index, setIndex] = useState(0);

  return (
    <View width={width} height={height} className="bg-primaryColor">
      {index === 0 && <OnBoardSliderItem {...data[0]} setIndex={setIndex} />}
      {index === 1 && <OnBoardSliderItem {...data[1]} setIndex={setIndex} />}
      {index === 2 && <OnBoardSliderItem {...data[2]} setIndex={setIndex} />}
      {index === 3 && <OnBoardSliderItem {...data[3]} setIndex={setIndex} />} 
    </View>
  );
};

export default OnBoardSlider;
