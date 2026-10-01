import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

const OrderTrackingTimeline = ({ statusdetails = [], orderId }) => {
  const events = Array.isArray(statusdetails) ? statusdetails : [];

  return (
    <View style={styles.container}>
      {!!orderId && <Text style={styles.orderId}>Order #{orderId}</Text>}
      {events.length === 0 ? (
        <Text style={styles.emptyText}>Tracking updates are not available yet.</Text>
      ) : events.map((event, index) => {
        const isLast = index === events.length - 1;
        const completeValue = event.isComplete ?? event.is_complete ?? '1';
        const isCompleted = completeValue === true || completeValue === 1 || String(completeValue) === '1';
        const label = event.note || event.status_name || event.status || 'Order update';
        const date = [event.bind_date, event.bind_time].filter(Boolean).join(' · ');

        return (
          <View key={event.status_id || event.id || index} style={styles.timelineRow}>
            <View style={styles.timelineMarkerColumn}>
              <View style={[styles.tickCircle, isCompleted ? styles.tickActive : styles.tickInactive]}>
                <Check size={12} color="#FFFFFF" strokeWidth={3} />
              </View>
              {!isLast && <View style={styles.verticalLine} />}
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventLabel}>{label}</Text>
              {!!date && <Text style={styles.eventTime}>{date}</Text>}
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
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 54,
  },
  timelineMarkerColumn: {
    alignItems: 'center',
    marginRight: 12,
    width: 22,
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
  verticalLine: {
    flex: 1,
    width: 2,
    marginVertical: 3,
    backgroundColor: '#E4E3E2',
  },
  eventContent: {
    flex: 1,
    paddingBottom: 16,
  },
  eventLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },
  eventTime: {
    fontSize: 11,
    color: '#787C77',
    marginTop: 3,
  },
  emptyText: {
    color: '#787887',
    fontSize: 13,
    paddingVertical: 12,
  },
  orderId: {
    color: '#263077',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
});

export default OrderTrackingTimeline;
