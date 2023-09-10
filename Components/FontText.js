import {Text} from 'react-native';

const FontText = ({style, children, weight}) => {
  return (
    <Text style={[{fontFamily: `Montserrat-${weight || "Regular"}`}, style]}>
      {children}
    </Text>
  );
};

export default FontText;
