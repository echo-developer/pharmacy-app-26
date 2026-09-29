import React, { useEffect, useRef, useState } from 'react';
import {
    Modal,
    Animated,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    Easing,
} from 'react-native';
import { CheckCircle2, XCircle } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StatusModal = ({
    visible,
    type = 'success',
    title,
    message,
    orderId,
    onClose,
    onPrimaryPress,
    onSecondaryPress,
    primaryButtonText,
    secondaryButtonText,
}) => {
    const [renderModal, setRenderModal] = useState(visible);
    const backdropAnim = useRef(new Animated.Value(0)).current;
    const sheetTranslateY = useRef(new Animated.Value(50)).current;
    const sheetOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setRenderModal(true);
            Animated.parallel([
                Animated.timing(backdropAnim, {
                    toValue: 1,
                    duration: 280,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(sheetTranslateY, {
                    toValue: 0,
                    duration: 320,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(sheetOpacity, {
                    toValue: 1,
                    duration: 260,
                    useNativeDriver: true,
                }),
            ]).start();
        } else if (renderModal) {
            Animated.parallel([
                Animated.timing(backdropAnim, {
                    toValue: 0,
                    duration: 220,
                    useNativeDriver: true,
                }),
                Animated.timing(sheetTranslateY, {
                    toValue: 50,
                    duration: 220,
                    useNativeDriver: true,
                }),
                Animated.timing(sheetOpacity, {
                    toValue: 0,
                    duration: 180,
                    useNativeDriver: true,
                }),
            ]).start(() => setRenderModal(false));
        }
    }, [visible]);

    const isSuccess = type === 'success';
    const accentColor = isSuccess ? '#10B981' : '#EF4444';
    const primaryBtnColor = isSuccess ? '#263077' : '#EF4444';

    if (!renderModal) return null;

    return (
        <Modal
            visible={renderModal}
            transparent
            animationType="none"
            statusBarTranslucent>
            <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onClose}
                    style={StyleSheet.absoluteFillObject}
                />

                <Animated.View
                    style={[
                        styles.sheetContainer,
                        {
                            opacity: sheetOpacity,
                            transform: [{ translateY: sheetTranslateY }],
                        },
                    ]}>
                    {/* Puller */}
                    <View style={styles.puller} />

                    {/* Icon */}
                    <View style={[styles.iconCircle, { backgroundColor: accentColor + '18' }]}>
                        {isSuccess
                            ? <CheckCircle2 size={52} color={accentColor} />
                            : <XCircle size={52} color={accentColor} />
                        }
                    </View>

                    <Text style={styles.titleText}>{title}</Text>
                    <Text style={styles.messageText}>{message}</Text>

                    {orderId ? (
                        <View style={styles.idBadge}>
                            <Text style={styles.idText}>
                                Order ID: <Text style={styles.idAccent}>#{orderId}</Text>
                            </Text>
                        </View>
                    ) : null}

                    <View style={styles.actionArea}>
                        <TouchableOpacity
                            onPress={onPrimaryPress}
                            activeOpacity={0.85}
                            style={[styles.button, { backgroundColor: primaryBtnColor }]}>
                            <Text style={styles.primaryBtnText}>{primaryButtonText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onSecondaryPress}
                            activeOpacity={0.7}
                            style={styles.secondaryButton}>
                            <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(10, 15, 30, 0.65)',
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        width: '100%',
        paddingTop: 16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 24,
        paddingHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -12 },
        shadowOpacity: 0.12,
        shadowRadius: 30,
        elevation: 18,
    },
    puller: {
        width: 42,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#CBD5E1',
        alignSelf: 'center',
        marginBottom: 14,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
    titleText: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 8,
    },
    messageText: {
        fontSize: 15,
        color: '#475569',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 22,
    },
    idBadge: {
        alignSelf: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 22,
    },
    idText: {
        color: '#64748B',
        fontSize: 12,
        fontWeight: '700',
    },
    idAccent: {
        color: '#0F172A',
    },
    actionArea: {
        width: '100%',
    },
    button: {
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    primaryBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    secondaryButton: {
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CBD5E1',
        backgroundColor: '#F8FAFC',
    },
    secondaryButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#475569',
    },
});

export default StatusModal;
