import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';

const SearchBar = ({ 
  placeholder = 'Search "Medicine Scroll"', 
  onSearch,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.searchWrapper}
        activeOpacity={onPress ? 0.8 : 1}
        onPress={onPress}
      >
        {/* Search Icon */}
        <Search size={20} color="#787C77" style={styles.searchIcon} />

        {/* Text Input */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#787C77"
          onChangeText={onSearch}
          editable={!onPress}
          pointerEvents={onPress ? 'none' : 'auto'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Header ke gradient ka bottom color (#FEFCFD) yahan background banaya
    backgroundColor: '#FEFCFD', 
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',        // Fill: FFFFFF
    borderWidth: 1,
    borderColor: '#D5D5D5',            // Borderline: D5D5D5 (Updated)
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#043250',
    paddingVertical: 0,
  },
});

export default SearchBar;