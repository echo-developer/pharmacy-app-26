import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, ChevronRight } from 'lucide-react-native';

const OrderTimelineCard = ({ events = [], onSeeAllUpdates, statusdetails }) => {
  // Use real order updates; do not show a sample timeline as if it belonged to this order.
  const updates = Array.isArray(statusdetails) ? statusdetails : [];
  const timelineEvents = updates.length > 0
    ? updates.map((sd, index) => ({
        id: index,
        label: `${sd.note || 'Order Update'}, ${sd.bind_date || ''} ${sd.bind_time || ''}`,
        isCompleted: sd.isComplete === true || sd.isComplete === 1 || String(sd.isComplete) === '1',
      }))
    : events;
  return (
    <View style={styles.card}>
      {/* ===== Timeline Events ===== */}
      {timelineEvents.length === 0 ? (
        <Text style={styles.emptyText}>Tracking updates are not available yet.</Text>
      ) : timelineEvents.map((event, index) => {
        const isLast = index === timelineEvents.length - 1;
        return (
          <View key={event.id} style={styles.eventRow}>
            {/* Left: Tick + Line */}
            <View style={styles.leftCol}>
              {/* Tick Circle */}
              <View
                style={[
                  styles.tickCircle,
                  event.isCompleted
                    ? styles.tickActive
                    : styles.tickInactive,
                ]}
              >
                <Check
                  size={12}
                  color="#FFFFFF"
                  strokeWidth={3}
                />
              </View>

              {/* Connecting Line */}
              {!isLast && <View style={styles.line} />}
            </View>

            {/* Right: Text */}
            <Text
              style={[
                styles.eventText,
                !event.isCompleted && styles.eventTextInactive,
              ]}
            >
              {event.label}
            </Text>
          </View>
        );
      })}

      {/* ===== See All Updates Button ===== */}
      {timelineEvents.length > 0 && <TouchableOpacity
        style={styles.seeAllBtn}
        onPress={onSeeAllUpdates}
        activeOpacity={0.85}
      >
        <Text style={styles.seeAllText}>See all updates</Text>
        <ChevronRight size={18} color="#787C77" />
      </TouchableOpacity>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 14,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.04,
    // shadowRadius: 4,
    // elevation: 2,
  },

  /* ===== Event Row ===== */
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 46,
  },
  leftCol: {
    alignItems: 'center',
    marginRight: 12,
    width: 20,
  },
  tickCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickActive: {
    backgroundColor: '#34C759',       // Active tick bg
  },
  tickInactive: {
    backgroundColor: '#E4E3E2',       // Inactive tick bg
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#E4E3E2',       // Connecting line
    marginTop: 2,
  },

  /* ===== Event Text ===== */
  eventText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',                 // Active event text
    marginTop: 1,
  },
  eventTextInactive: {
    color: '#333333',                 // Same color (as per spec)
  },

  /* ===== See All Button ===== */
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4E3E2',           // Border
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 14,
    gap: 6,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#787C77',                 // Text
  },
  emptyText: {
    color: '#787887',
    fontSize: 13,
    paddingVertical: 8,
  },
});

export default OrderTimelineCard;
