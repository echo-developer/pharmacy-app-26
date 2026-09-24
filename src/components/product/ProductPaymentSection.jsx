import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Banknote, RefreshCw, CalendarX, FileText } from 'lucide-react-native';

const ROWS = [
  {
    id: 1,
    title: 'Cash on Delivery available',
    subtitle:
      "Get your product first, then pay us once you're sure about your order",
    Icon: Banknote,
    iconColor: '#34C759',
  },
  {
    id: 2,
    title: '7 day free return',
    subtitle: "Easily return the product if you don't need it anymore",
    Icon: RefreshCw,
    iconColor: '#2CB7DF',
  },
  {
    id: 3,
    title: 'Product expires after Jan., 2027',
    subtitle: 'We only stock items that keep their quality over time.',
    Icon: CalendarX,
    iconColor: '#FF6565',
  },
  {
    id: 4,
    title: 'Price info',
    subtitle:
      'The price displayed is the MRP. Lorem ipsum dolor sit amet',
    Icon: FileText,
    iconColor: '#263077',
  },
];

const ProductPaymentSection = ({
  title = 'Payment, Returns & Expiry',
  rows = ROWS,
}) => {
  return (
    <LinearGradient
      colors={['#AAF4E4', '#F9F9FB']}      // Top → Bottom
      start={{ x: 0, y: 0 }}                // Top
      end={{ x: 0, y: 1 }}                  // Bottom
      locations={[0.34, 1]}
      style={styles.outerWrapper}
    >
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.whiteTab}>
        {rows.map((row) => {
          const Icon = row.Icon;
          return (
            <View key={row.id} style={styles.row}>
              <View style={styles.iconTab}>
                <Icon size={22} color={row.iconColor} />
              </View>

              <View style={styles.textCol}>
                <Text style={styles.rowTitle}>{row.title}</Text>
                <Text style={styles.rowSubtitle}>{row.subtitle}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#043250',
    marginBottom: 14,
  },
  whiteTab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  iconTab: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#D9F7F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textCol: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#043250',
    lineHeight: 17,
  },
  rowSubtitle: {
    fontSize: 11,
    color: '#787887',
    lineHeight: 15,
    marginTop: 3,
  },
});

export default ProductPaymentSection;