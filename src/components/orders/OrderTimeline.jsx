import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

const OrderTimeline = ({ steps }) => {
  // Index of last completed step
  const lastCompletedIndex = steps.reduce(
    (acc, step, i) => (step.isCompleted ? i : acc),
    -1,
  );

  // Is there a next step after the last completed one? (i.e. in-progress)
  const inProgressIndex =
    lastCompletedIndex >= 0 && lastCompletedIndex < steps.length - 1
      ? lastCompletedIndex + 1
      : -1;

  return (
    <View style={styles.container}>
      {/* Steps Row */}
      <View style={styles.stepsRow}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          // Line after this step goes to next step
          const nextIsInProgress = index === lastCompletedIndex && inProgressIndex !== -1;
          const lineIsGreen = steps[index]?.isCompleted && (steps[index + 1]?.isCompleted || nextIsInProgress);

          return (
            <React.Fragment key={index}>
              {/* Step Circle */}
              <View style={styles.stepColumn}>
                {step.isCompleted ? (
                  <View style={styles.activeTick}>
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  </View>
                ) : (
                  <View style={styles.inactiveTick}>
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </View>

              {/* Connecting Line — split with dot at end if in-progress */}
              {!isLast && (
                <View style={styles.lineWrapper}>
                  {nextIsInProgress ? (
                    // Green line + dot at the end
                    <>
                      <View style={[styles.line, { backgroundColor: '#00A06B', flex: 1 }]} />
                      <View style={styles.currentOuter}>
                        <View style={styles.currentInner} />
                      </View>
                      <View style={[styles.line, { backgroundColor: '#EAEAEA', flex: 1 }]} />
                    </>
                  ) : (
                    <View
                      style={[
                        styles.line,
                        { backgroundColor: lineIsGreen ? '#00A06B' : '#EAEAEA', flex: 1 },
                      ]}
                    />
                  )}
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Labels Row */}
      <View style={styles.labelsRow}>
        {steps.map((step, index) => (
          <Text
            key={index}
            style={[
              styles.label,
              step.isCompleted ? styles.labelActive : styles.labelInactive,
            ]}
          >
            {step.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  stepColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Completed step
  activeTick: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#00A06B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Future/inactive step
  inactiveTick: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DEDEDE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Line container
  lineWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  line: {
    height: 3,
    borderRadius: 2,
  },

  // Progress dot on the line — outer #95F8D7, inner #00A06B
  currentOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#95F8D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00A06B',
  },

  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  labelActive: {
    color: '#333333',
  },
  labelInactive: {
    color: '#DEDEDE',
  },
});

export default OrderTimeline;
