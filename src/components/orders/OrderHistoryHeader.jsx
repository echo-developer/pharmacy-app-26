import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Search, X } from 'lucide-react-native';

const OrderHistoryHeader = ({
  title = 'Order History',
  onBackPress,
  onSearchPress,
  isSearching = false,
  searchQuery = '',
  onChangeSearchQuery,
  onCloseSearch,
}) => {
  if (isSearching) {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onCloseSearch}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#25485B" />
        </TouchableOpacity>

        <View style={styles.searchInputWrapper}>
          <Search size={18} color="#787C77" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders..."
            placeholderTextColor="#787C77"
            value={searchQuery}
            onChangeText={onChangeSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => onChangeSearchQuery?.('')}>
              <X size={18} color="#787C77" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      {/* LEFT: Back Arrow + Title */}
      <View style={styles.leftGroup}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#25485B" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>
      </View>

      {/* RIGHT: Search */}
      <TouchableOpacity
        style={styles.searchCircle}
        onPress={onSearchPress}
        activeOpacity={0.7}
      >
        <Search size={20} color="#263077" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingVertical: 14,
    backgroundColor: '#F6F6F6',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#043250',
    letterSpacing: 0.2,
  },
  searchCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#043250',
    paddingVertical: 0,
  },
});

export default OrderHistoryHeader;