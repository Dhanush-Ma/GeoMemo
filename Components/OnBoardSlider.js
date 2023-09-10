import {FlatList, View, Dimensions} from 'react-native';
import onBoardData from '../Data/onBoardData';
import SliderItem from './SliderItem';
import {useState} from 'react';
import data from '../Data/onBoardData';
const OnBoardSlider = () => {
  const {width, height} = Dimensions.get('screen');
  const [index, setIndex] = useState(0);

  return (
    <View width={width} height={height} className="bg-primaryColor">
      {index === 0 && <SliderItem {...data[0]} setIndex={setIndex} />}
      {index === 1 && <SliderItem {...data[1]} setIndex={setIndex} />}
      {index === 2 && <SliderItem {...data[2]} setIndex={setIndex} />}
      {index === 3 && <SliderItem {...data[3]} setIndex={setIndex} />}
    </View>
  );
};

export default OnBoardSlider;
