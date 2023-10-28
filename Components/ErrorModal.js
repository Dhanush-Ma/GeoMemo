import {View, Text, useWindowDimensions} from 'react-native';
import {useState, useEffect} from 'react';
import FontText from './FontText';
import {MotiView} from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ErrorModal = ({text, setError}) => {
  const {width} = useWindowDimensions();
  const [isAnimating, setIsAnimating] = useState(true);
  

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => {
        toggleAnimation();
        clearTimeout(timeout);
      }, 5000);
    }
  }, [isAnimating]);

  useEffect(() => {
    const interval = setInterval(() => {
      setError('');
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <MotiView
      key={text}
      from={{translateY: -200, translateX: width / 2}}
      animate={{translateY: isAnimating ? 0 : -200, translateX: width / 2}}
      style={{
        width: width - 40,

        left: '-45%',
      }}
      className="bg-errorColor rounded-md absolute top-10 px-6 py-3 flex flex-row justify-center items-center z-[100]">
      <MaterialIcons name="error-outline" size={25} />
      <FontText className="ml-3 text-justify text-base " weight={'Medium'}>
        {text}
      </FontText>
    </MotiView>
  );
};

export default ErrorModal;
