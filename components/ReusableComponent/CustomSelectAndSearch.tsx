import React, { useState, useEffect } from "react";
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  FlatList,
  Keyboard,
  Platform,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
interface DropdownItem {
    label: string;
    value: string;
  }
interface CustomSelectAndSearchProps {
  data: DropdownItem[];
  placeholder?: string;
  value?: string;
  onChange: (item: string) => void;
  searchPlaceholder?: string;
  disabled?: boolean;
}

const CustomSelectAndSearch: React.FC<CustomSelectAndSearchProps> = ({
  data,
  placeholder = "Select an option",
  value = "",
  onChange,
  searchPlaceholder = "Search...",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    if (searchText === "") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((item) =>
          item.label.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, data]);

  const handleSelect = (item: string) => {
    setSelectedValue(item);
    onChange(item);
    setIsOpen(false);
    setSearchText("");
    Keyboard.dismiss();
  };

  const closeDropdown = () => {
    setIsOpen(false);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, disabled && styles.disabled]}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Text style={[styles.headerText, !selectedValue && styles.placeholder]}>
          {(selectedValue || placeholder).length > 15
            ? (selectedValue || placeholder).substring(0, 18) + "..."
            : selectedValue || placeholder}
        </Text>
        <MaterialIcons
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="gray"
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={[styles.dropdown, Platform.OS === 'ios' ? styles.shadowIOS : styles.shadowAndroid]}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="gray" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
          </View>

          <FlatList
            data={filteredData}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item.value)}
              >
                <Text style={styles.itemText}>{item.label}</Text>
                {selectedValue === item.value && (
                  <MaterialIcons name="check" size={20} color="#93BD68" />
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.noResults}>{searchText ? "No matches found" : "No options available"}</Text>
            }
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginVertical: 8,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  disabled: {
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    fontSize: 16,
    color: "#333",
  },
  placeholder: {
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdown: {
    position: "absolute",
    top: "30%",
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    maxHeight: 300,
  },
  shadoIOS: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  shadowAndroid: {
    elevation: 5,
  },
  shadowIOS: {
    elevation: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  noResults: {
    padding: 16,
    textAlign: "center",
    color: "#999",
  },
});

export default CustomSelectAndSearch;