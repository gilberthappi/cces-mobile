import React, { useState } from "react";
import { Platform, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import RNDateTimePicker, { 
  DateTimePickerEvent, 
  DateTimePickerAndroid,
  AndroidNativeProps 
} from "@react-native-community/datetimepicker";

interface DateTimePickerProps {
  mode?: 'date' | 'time' | 'datetime';
  value?: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  display?: 'spinner' | 'default' | 'clock' | 'calendar';
  placeholder?: string;
  buttonStyle?: object;
  textStyle?: object;
}

export default function DateTimePicker({
  mode = 'date',
  value,
  onChange,
  minimumDate,
  maximumDate,
  display = Platform.OS === 'ios' ? 'spinner' : 'default',
  placeholder = 'Select date', 
  buttonStyle = {},
  textStyle = {},
}: DateTimePickerProps) {
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const displayText = value ? formatDate(value, mode) : placeholder;

  if (Platform.OS === 'android') {
    const androidMode: AndroidNativeProps['mode'] = mode === 'datetime' ? 'date' : mode;

    return (
      <View>
        <TouchableOpacity
          style={[styles.button, buttonStyle]}
          onPress={() => {
            DateTimePickerAndroid.open({
              value: value || new Date(),
              onChange: handleChange,
              mode: androidMode,
              minimumDate,
              maximumDate,
              display,
            });
          }}
        >
          <Text style={[styles.text, textStyle]}>{displayText}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      {show || Platform.OS === 'ios' ? (
        <RNDateTimePicker
          value={value || new Date()}
          mode={mode}
          display={display}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          style={styles.picker}
        />
      ) : (
        <TouchableOpacity
          style={[styles.button, buttonStyle]}
          onPress={() => setShow(true)}
        >
          <Text style={[styles.text, textStyle]}>{displayText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function formatDate(date: Date, mode: 'date' | 'time' | 'datetime') {
  if (mode === 'time') {
    return date.toLocaleTimeString();
  }
  if (mode === 'date') {
    return date.toLocaleDateString();
  }
  return date.toLocaleString();
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: '#333',
  },
  picker: {
    width: '100%',
  },
});