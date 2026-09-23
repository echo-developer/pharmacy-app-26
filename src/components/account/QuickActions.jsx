import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingBasket, Wallet, MessageCircleQuestion } from 'lucide-react-native';

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
];

const QuickActions = ({ onOrdersPress, onWalletPress, onHelpPress }) => {
  const handlers = {
    orders: onOrdersPress,
    wallet: onWalletPress,
    help: onHelpPress,
  };

  return (
    <View style={styles.container}>
      {actions.map((item) => {
        const Icon = item.Icon;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={handlers[item.id]}
          >
            <Icon size={36} color={item.iconColor} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  card: {
    flex: 1,
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
});

export default QuickActions;