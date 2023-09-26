import {
  View,
  Text,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import FontText from '../FontText';
import {useState} from 'react';

const Contacts = ({data, onChange, setShowContacts, value}) => {
  const [searchText, setSearchText] = useState('');
  const filteredContacts = data.filter(item =>
    item.displayName.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <KeyboardAvoidingView className="h-[65vh] absolute top-20 w-full z-30 bg-secondaryColor">
      <TextInput
        onChangeText={text => setSearchText(text)}
        value={searchText}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="default"
        returnKeyType="done"
        onSubmitEditing={() => {}}
        placeholder="Search..."
        caretHidden
        placeholderTextColor={'#FFF'}
        className="bg-secondaryColor1 rounded-md px-5 text-white mb-2 text-lg"
      />
      <ScrollView className="h-[90%] ">
        {searchText
          ? filteredContacts.map((item, index) => (
              <Item
                item={item}
                key={index}
                onChange={onChange}
                setShowContacts={setShowContacts}
                value={value}
              />
            ))
          : data.map((item, index) => (
              <Item
                item={item}
                key={index}
                onChange={onChange}
                setShowContacts={setShowContacts}
                value={value}
              />
            ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Item = ({item, onChange, setShowContacts, value}) => {
  const {displayName, phoneNumber} = item;
  return (
    <Pressable
      onPress={() => {
        setShowContacts(false);
        onChange(item);
      }}
      className="p-3 py-4"
      style={{
        backgroundColor:
          value.displayName === item.displayName &&
          value.phoneNumber === item.phoneNumber
            ? '#202020'
            : '#8766eb',
      }}>
      <FontText weight={'Medium'}>{`${displayName} (${phoneNumber})`}</FontText>
    </Pressable>
  );
};

export default Contacts;
