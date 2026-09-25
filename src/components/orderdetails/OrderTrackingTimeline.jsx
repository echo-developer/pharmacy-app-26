import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

const SECTIONS = [
  {
    id: 1,
    title: 'Order Confirmed',
    date: 'Mon. 14th Jun, 2026',
    isCompleted: true,
    events: [
      { id: 1, label: 'Your order has been placed', time: 'Sat. 15th Jun, 2026 - 10:21 am' },
      { id: 2, label: 'Seller has processed your order', time: 'Sun. 16th Jun, 2026 - 10:21 am' },
      { id: 3, label: 'Shipped', time: 'Your item has been shipped' },
    ],
  },
  {
    id: 2,
    title: 'Out for Delivery',
    date: 'Mon. 14th Jun, 2026',
    isCompleted: true,
    events: [
      { id: 1, label: 'Your item is out for delivery', time: 'Your item has been shipped' },
    ],
  },
  {
    id: 3,
    title: 'Delivered',
    date: 'Mon. 14th Jun, 2026',
    isCompleted: false,
    events: [
      { id: 1, label: 'Your item has been delivered', time: 'Your item has been shipped' },
    ],
  },
];

const OrderTrackingTimeline = ({ sections = SECTIONS }) => {
  return (
    <View style={styles.container}>
      {sections.map((section, sIndex) => {
        const isLastSection = sIndex === sections.length - 1;

        // ✅ Line color = next section ke isCompleted pe depend
        const nextSection = !isLastSection ? sections[sIndex + 1] : null;
        const lineColor =
          nextSection && nextSection.isCompleted ? '#00A06B' : '#E4E3E2';

        return (
          <View key={section.id} style={styles.sectionBlock}>
            {/* ===== Section Header ===== */}
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.tickCircle,
                  section.isCompleted ? styles.tickActive : styles.tickInactive,
                ]}
              >
                <Check size={12} color="#FFFFFF" strokeWidth={3} />
              </View>

              <View style={styles.titleRow}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionDate}>{section.date}</Text>
              </View>
            </View>

            {/* ===== Events + Vertical Line ===== */}
            <View style={styles.eventsWrapper}>
              {/* Vertical line (only if not last section) */}
              {!isLastSection && (
                <View
                  style={[
                    styles.verticalLine,
                    { backgroundColor: lineColor },
                  ]}
                />
              )}

              {/* Events */}
              <View style={styles.eventsContent}>
                {section.events.map((event) => (
                  <View key={event.id} style={styles.eventRow}>
                    <Text style={styles.eventLabel}>{event.label}</Text>
                    <Text style={styles.eventTime}>{event.time}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
  },
  sectionBlock: {
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tickCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  tickActive: {
    backgroundColor: '#00A06B',
  },
  tickInactive: {
    backgroundColor: '#E4E3E2',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333333',
    marginRight: 8,
  },
  sectionDate: {
    fontSize: 11,
    color: '#787C77',
    fontWeight: '500',
  },
  eventsWrapper: {
    flexDirection: 'row',
    paddingLeft: 10,
  },
  verticalLine: {
    width: 2,
    marginRight: 12,
    borderRadius: 1,
  },
  eventsContent: {
    flex: 1,
    paddingBottom: 8,
  },
  eventRow: {
    marginBottom: 16,
  },
  eventLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  eventTime: {
    fontSize: 11,
    color: '#787C77',
    marginTop: 3,
  },
});

export default OrderTrackingTimeline;