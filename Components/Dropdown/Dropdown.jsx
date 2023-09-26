import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Contacts from './Contacts';
import FontText from '../FontText';
const Dropdown = ({data, onFocus, onChange, value}) => {
  const [showContacts, setShowContacts] = useState(false);

  const handleOnPress = () => {
    onFocus();
    setShowContacts(!showContacts);
  };

  return (
    <>
      <View className=" w-full">
        <Pressable
          onPress={handleOnPress}
          className="flex flex-row border-2 border-accentColor2 px-3 py-4 justify-between items-center w-full rounded-md mb-5">
          <View className="flex flex-row space-x-3 items-center">
            <AntDesign name="contacts" size={25} color="#8766eb" />
            <Text className="text-lg">
              {value.displayName ? value.displayName : 'Select Contact'}
            </Text>
          </View>
          <AntDesign name="down" size={15} color="#f7f7f7" />
        </Pressable>
        {showContacts && (
          <Contacts
            data={data}
            onChange={onChange}
            setShowContacts={setShowContacts}
            value={value}
          />
        )}
      </View>
    </>
  );
};

export default Dropdown;
