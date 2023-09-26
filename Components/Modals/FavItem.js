import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import React from 'react';
import {useState} from 'react';
import FontText from '../FontText';
import IonIcons from 'react-native-vector-icons/Ionicons';

const FavItem = ({fav, handleRemoveItem, handleSetFavLocation}) => {
  const [loading, setLoading] = useState(false);
  return (
    <TouchableOpacity onPress={() => handleSetFavLocation(fav.coords)}>
      <View className="bg-accentColor2 w-full px-3 py-4 mb-3 flex flex-row justify-between items-center rounded-md">
        <FontText className="text-lg font-medium text-textColor">
          {fav.name}
        </FontText>
        <Pressable
          onPress={() => {
            setLoading(true);
            handleRemoveItem(fav);
          }}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <IonIcons name="remove-circle-sharp" size={30} />
          )}
        </Pressable>
      </View>
    </TouchableOpacity>
  );
};

export default FavItem;
