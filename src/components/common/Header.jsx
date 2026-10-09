import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, ShoppingBag, MapPin, Navigation } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import store from '../../store/store';
import CommonService from '../../utils/CommonService';

const Header = ({ 
  userName,
  location, 
  cartCount,
  includeSafeAreaTop = true,
  transparentBackground = false,
  onLayout,
  onLocationPress,
  onCartPress 
}) => {
  const insets = useSafeAreaInsets();
  const [storeState, setStoreState] = React.useState(store.getState().GlobalReducer);
  const [availableCities, setAvailableCities] = React.useState([]);
  const [savedAddresses, setSavedAddresses] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setStoreState(store.getState().GlobalReducer);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    CommonService._callApi({ api: '/home/city', method: 'GET' })
      .then(response => {
        const cities = response.data?.response?.data;
        if (isMounted && Array.isArray(cities)) setAvailableCities(cities);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const activePlaceId = storeState.chosencity?.tempaddress?.place_id;
  React.useEffect(() => {
    if (!storeState.authuser || !activePlaceId) return undefined;
    let isMounted = true;
    CommonService._callApi({ api: '/member/address', method: 'GET' })
      .then(response => {
        const addresses = response.data?.response?.data;
        if (isMounted && Array.isArray(addresses)) setSavedAddresses(addresses);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [activePlaceId, storeState.authuser]);

  const activeCity = storeState.chosencity;
  const address = location || activeCity?.tempaddress?.address || '';
  const selectedAddress = savedAddresses.find(item => String(item.place_id) === String(activePlaceId));
  const selectedCityId = activeCity?.city_id || activeCity?.tempaddress?.city_id ||
    selectedAddress?.place_city_id || selectedAddress?.city_id;
  const cityFromList = availableCities.find(city => String(city.city_id) === String(selectedCityId));
  const placeName = activeCity?.city_name || activeCity?.place_city || activeCity?.city || activeCity?.main_city ||
    activeCity?.tempaddress?.city_name || activeCity?.tempaddress?.place_city || activeCity?.tempaddress?.city || activeCity?.tempaddress?.main_city ||
    selectedAddress?.city_name || selectedAddress?.place_city ||
    cityFromList?.city_name ||
    activeCity?.place_name || activeCity?.locality || activeCity?.area ||
    activeCity?.tempaddress?.place_name || activeCity?.tempaddress?.locality || activeCity?.tempaddress?.area ||
    address.split(',').map(part => part.trim()).filter(part => part && !/^\d{5,6}$/.test(part)).at(-1)?.replace(/^(north|south|east|west|central)\s+/i, '');
  const stateName = activeCity?.state_name || activeCity?.state || activeCity?.tempaddress?.state_name || activeCity?.tempaddress?.state ||
    (cityFromList ? 'Bengal' : '');
  const locationTitle = [placeName, stateName].filter(Boolean).join(', ') ||
    (activeCity?.tempaddress?.postalcode ? `Pincode ${activeCity.tempaddress.postalcode}` : 'Select delivery location');
  const displayName = userName || locationTitle;
  const displayLocation = address ||
    (activeCity?.tempaddress?.postalcode ? `Pincode ${activeCity.tempaddress.postalcode}` : 'Select delivery location');
  const shortLocation = displayLocation.length > 18
    ? `${displayLocation.slice(0, 18).trimEnd()}...`
    : displayLocation;
  const displayCartCount = cartCount !== undefined ? cartCount : (storeState.cart?.items?.length || 0);
  const HeaderContainer = transparentBackground ? View : LinearGradient;
  const gradientProps = transparentBackground
    ? {}
    : {
        colors: ['#E3FCE4', '#FEFCFD'],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
      };

  return (
    <HeaderContainer
      {...gradientProps}
      onLayout={onLayout}
      style={[styles.container, { paddingTop: (includeSafeAreaTop ? insets.top : 0) + 8 }]}
    >
      {/* LEFT SIDE */}
      <TouchableOpacity style={styles.leftContainer} onPress={onLocationPress} activeOpacity={0.8}>
        <View style={styles.iconCircle}>
          <Navigation size={18} color="#FFFFFF" fill="#FFFFFF" />
        </View>

        <View style={styles.textColumn}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{displayName}</Text>
            <ChevronDown size={16} color="#043250" style={styles.dropdownArrow} />
          </View>
          
          <View style={styles.locationRow}>
            <MapPin size={12} color="#787887" style={styles.locationIcon} />
            <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
              {shortLocation}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* RIGHT SIDE */}
      <TouchableOpacity style={styles.cartButton} onPress={onCartPress}>
        <View style={styles.cartIconWrapper}>
          <ShoppingBag size={22} color="#263077" />
          {displayCartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{displayCartCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </HeaderContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  // ... baaki styles same rahenge
  leftContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#2CB7DF',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  textColumn: { flex: 1, minWidth: 0, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  userName: { fontSize: 16, fontWeight: '700', color: '#043250' },
  dropdownArrow: { marginLeft: 4, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  locationIcon: { marginRight: 4 },
  locationText: { flex: 1, minWidth: 0, maxWidth: 170, fontSize: 12, color: '#787887' },
  cartButton: { padding: 4 },
  cartIconWrapper: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#263077',
  },
  badge: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: '#709D2A',
    borderRadius: 10, minWidth: 18, height: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#FFFFFF',
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
});

export default Header;
