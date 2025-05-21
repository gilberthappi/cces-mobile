import React, { useState } from "react";
import { View, Text } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons } from "@expo/vector-icons";

interface DropdownItem {
  label: string;
  value: string;
}

interface CustomDropDownProps {
  data: DropdownItem[];
  placeholder?: string;
  value?: string | null;
  onChange: (item: DropdownItem) => void;
  label?: string;
  error?: string;
  searchable?: boolean;
  disabled?: boolean;
  containerStyle?: object;
  dropdownStyle?: object;
  placeholderStyle?: object;
  selectedTextStyle?: object;
  errorTextStyle?: object;
  labelStyle?: object;
  icon?: React.ReactNode;
}

export default function CustomDropDown({
  data,
  placeholder = "Select an item",
  value = null,
  onChange,
  label,
  error,
  searchable = false,
  disabled = false,
  containerStyle = {},
  dropdownStyle = {},
  placeholderStyle = {},
  selectedTextStyle = {},
  errorTextStyle = {},
  labelStyle = {},
  icon,
}: CustomDropDownProps) {
  const [isFocus, setIsFocus] = useState(false);

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
          style={{
            paddingHorizontal: 10,
          }}
          placeholderStyle={{ ...placeholderStyle, color: 'gray' }}
          selectedTextStyle={selectedTextStyle}
          data={data}
          search={searchable}
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? placeholder : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            onChange(item);
            setIsFocus(false);
          }}
          disable={disabled}
          renderItem={(item) => (
            <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
              <Text style={{ flex: 1 }}>{item.label}</Text>
              {value === item.value && (
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