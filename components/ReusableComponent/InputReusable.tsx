import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import CheckBox from "@react-native-community/checkbox";
import { SelectList } from 'react-native-dropdown-select-list';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get("window");

interface InputReusableProps {
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox';
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  options?: { key: string; value: string }[];
  selectedOption?: string;
  onOptionChange?: (value: string) => void;
  isChecked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  placeholder?: string; 
}

const InputReusable: React.FC<InputReusableProps> = ({
  type,
  label,
  value,
  onChangeText,
  options,
  onOptionChange,
  isChecked,
  onCheckChange,
  placeholder,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {type === 'text' && (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={'gray'}
        />
      )}
      {type === 'textarea' && (
        <TextInput
          style={[styles.input, styles.textArea]}
          value={value}
          onChangeText={onChangeText}
          multiline
          placeholder={placeholder} 
          placeholderTextColor={'gray'}
        />
      )}
      {type === 'select' && options && (
        <SelectList
          setSelected={onOptionChange || (() => {})}
          data={options}
          save="value"
          placeholder={placeholder || 'Select an option'} 
          dropdownStyles={styles.select}
          dropdownTextStyles={styles.option}
          boxStyles={styles.boxStyle}

        />
      )}
      {type === 'checkbox' && (
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isChecked}
            onValueChange={onCheckChange}
          />
          <Text >{label}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    fontSize: height * 0.02,
    padding: 10,
    backgroundColor: 'white',
  },
  label:{
    fontSize: height * 0.02,
    marginBottom: height * 0.009,
  },
  textArea: {
    height: 80,
    fontSize: height * 0.02,
    borderRadius:20
  },
  select: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    fontSize: height * 0.02,

  },
  option: {
    color: 'black',
    fontSize: height * 0.02,


  },
  boxStyle:{
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
 borderRadius:20
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default InputReusable;
