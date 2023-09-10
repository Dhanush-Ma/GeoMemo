import {View, Text} from 'react-native';
import {useState, useEffect} from 'react';
import FontText from './FontText';
import {MotiView, MotiText} from 'moti';

const ErrorModal = ({text, setError}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress(prev => prev + 2);
      }
    }, 100);

    const interval = setInterval(() => {
      setError('');
    }, 5100);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  return (
    <MotiView
      from={{translateY: -100}}
      animate={{translateY: 0}}
      transition={{
        translateY: {
          type: 'spring',
        },
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
      }}
      exitTransition={{
        type: 'timing',
        duration: 2500,
      }}
      className="bg-errorColor rounded-md w-full absolute top-10">
      <View className="px-2 py-3">
        <FontText className="text-center text-[20px]" weighst={'Bold'}>
          {text}
        </FontText>
      </View>
      {/* <View className="h-2 overflow-hidden">
        <View
          style={{width: `${progress}%`}}
          className="bg-[#e09698] h-full rounded-bl-md"></View>
      </View> */}
    </MotiView>
  );
};

export default ErrorModal;
