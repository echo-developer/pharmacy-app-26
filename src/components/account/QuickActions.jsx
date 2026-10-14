import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { ShoppingBasket, Wallet, MessageCircleQuestion, Phone } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

const actions = [
  {
    id: 'orders',
    label: 'Orders',
    Icon: ShoppingBasket,
    iconColor: '#F5A623',
  },
  {
    id: 'wallet',
    label: 'Wallet',
    Icon: Wallet,
    iconColor: '#34C759',
  },
  {
    id: 'help',
    label: 'Help',
    Icon: MessageCircleQuestion,
    iconColor: '#2CB7DF',
  },
  { id: 'whatsapp', label: 'WhatsApp', Icon: null, iconColor: '#25D366' },
  { id: 'call', label: 'Call', Icon: Phone, iconColor: '#273179' },
];

const QuickActions = ({ onOrdersPress, onWalletPress, onHelpPress, onWhatsAppPress, onCallPress }) => {
  const handlers = {
    orders: onOrdersPress,
    wallet: onWalletPress,
    help: onHelpPress,
    whatsapp: onWhatsAppPress,
    call: onCallPress,
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {actions.map((item) => {
        const Icon = item.Icon;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={handlers[item.id]}
          >
            {item.id === 'whatsapp' ? (
              <View style={styles.whatsappIcon}>
                <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                  <Path fill="#FFFFFF" d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.53 0 .2 5.34.2 11.89c0 2.1.55 4.14 1.59 5.95L.1 24l6.31-1.65a11.87 11.87 0 0 0 5.67 1.44h.01c6.55 0 11.89-5.33 11.89-11.89a11.82 11.82 0 0 0-3.46-8.42ZM12.09 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.22-3.74.98 1-3.64-.24-.38a9.86 9.86 0 0 1-1.51-5.27c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.88 9.89Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.11.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                </Svg>
              </View>
            ) : <Icon size={36} color={item.iconColor} />}
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
    flexDirection: 'row',
  },
  card: {
    width: 132,
    height: 132,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.04,
    // shadowRadius: 4,
    // elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#263077',
    marginTop: 10,
  },
  whatsappIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QuickActions;
