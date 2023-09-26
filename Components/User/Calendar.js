import {View, Text, useWindowDimensions, Pressable} from 'react-native';
import {useState} from 'react';
import {Calendar, LocaleConfig} from 'react-native-calendars';

const CalendarModal = ({setDate, date, setShowCalendar}) => {
  const {width, height} = useWindowDimensions();

  return (
    <View
      className="bg-[#121212]/50 absolute top-0 right-0 w-screen h-screen flex justify-center items-center"
      style={{width, height}}>
      <View className="min-w-[80%]">
        <Calendar
          initialDate={date}
          onDayPress={day => {
            setDate(day.dateString);
            setShowCalendar(false);
          }}
          markedDates={{
            [date]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: 'orange',
            },
          }}
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            height: 350,
            borderRadius: 20,
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e',
          }}
        />
      </View>
    </View>
  );
};

export default CalendarModal;
