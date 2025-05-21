import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons } from "@expo/vector-icons";

interface DropdownItem {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  data: DropdownItem[];
  placeholder?: string;
  selectedValues?: string[];
  onChange: (selectedItems: DropdownItem[]) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  containerStyle?: object;
  dropdownStyle?: object;
  placeholderStyle?: object;
  selectedTextStyle?: object;
  errorTextStyle?: object;
  labelStyle?: object;
  icon?: React.ReactNode;
}

export default function MultiSelectDropdown({
  data,
  placeholder = "Select items",
  selectedValues = [],
  onChange,
  label,
  error,
  disabled = false,
  containerStyle = {},
  dropdownStyle = {},
  placeholderStyle = {},
  selectedTextStyle = {},
  errorTextStyle = {},
  labelStyle = {},
  icon,
}: MultiSelectDropdownProps) {
  const [isFocus, setIsFocus] = useState(false);

  const handleItemSelection = (item: DropdownItem) => {
    let newSelectedItems;
    if (selectedValues.includes(item.value)) {
      // Remove if already selected
      newSelectedItems = data.filter(d => 
        selectedValues.includes(d.value) && d.value !== item.value
      );
    } else {
      // Add to selection
      newSelectedItems = [...data.filter(d => selectedValues.includes(d.value)), item];
    }
    onChange(newSelectedItems);
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      
      <View style={[
        dropdownStyle,
        isFocus && { borderColor: '#93BD68' },
        error && { borderColor: '#ff3b30' },
        disabled && { backgroundColor: '#f5f5f5' },
      ]}>
        {icon}
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={{ ...placeholderStyle, color: 'transparent' }}
          selectedTextStyle={{ ...selectedTextStyle, color: 'transparent' }}
          data={isFocus ? data : data.slice(0, 1)}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? (data.length > 1 ? `${placeholder}...` : placeholder) : '...'}
          value={null}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={handleItemSelection}
          disable={disabled}
          renderItem={(item) => (
            <View style={styles.item}>
              <Text style={styles.textItem}>{item.label}</Text>
              {selectedValues.includes(item.value) && (
                <MaterialIcons name="check" size={20} color="#93BD68" />
              )}
            </View>
          )}
        />
      </View>
      
      {error && <Text style={errorTextStyle}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    paddingHorizontal: 0,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
});