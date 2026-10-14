import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_PADDING = 16;
const CATEGORY_TILE_WIDTH = (SCREEN_WIDTH - 36 - 18 - 18) / 3;
const PRODUCT_DETAILS_WIDTH = SCREEN_WIDTH - 170;

export const SkeletonBlock = ({ width, height, style, radius = 8 }) => (
  <ShimmerPlaceholder
    width={width}
    height={height}
    style={[{ borderRadius: radius }, style]}
    shimmerColors={['#ECEFF3', '#F5F6F8', '#ECEFF3']}
    visible={false}
  />
);

export const HomeLoadingSkeleton = () => (
  <View style={styles.homeContent}>
    <SkeletonBlock width={SCREEN_WIDTH - HORIZONTAL_PADDING * 2} height={176} radius={18} />
    <View style={styles.section}>
      <SkeletonBlock width={170} height={20} />
      <View style={styles.horizontalRow}>
        {[0, 1, 2].map(item => <SkeletonBlock key={item} width={SCREEN_WIDTH * 0.42} height={150} radius={16} />)}
      </View>
    </View>
    <View style={styles.section}>
      <SkeletonBlock width={145} height={20} />
      <View style={styles.horizontalRow}>
        {[0, 1, 2, 3].map(item => <SkeletonBlock key={item} width={SCREEN_WIDTH * 0.28} height={124} radius={12} />)}
      </View>
    </View>
    <View style={styles.section}>
      <SkeletonBlock width={205} height={20} />
      <View style={styles.horizontalRow}>
        {[0, 1].map(item => <SkeletonBlock key={item} width={SCREEN_WIDTH * 0.48} height={205} radius={14} />)}
      </View>
    </View>
  </View>
);

export const CategoriesLoadingSkeleton = () => (
  <ScrollView contentContainerStyle={styles.categoriesContent} showsVerticalScrollIndicator={false}>
    <SkeletonBlock width={150} height={24} />
    {[0, 1, 2].map(section => (
      <View key={section} style={styles.categorySection}>
        <SkeletonBlock width={130 + section * 14} height={20} />
        <View style={styles.categoryPanel}>
          <View style={styles.categoryGrid}>
            {[0, 1, 2, 3, 4, 5].map(tile => (
              <View key={tile} style={styles.categoryTile}>
                <SkeletonBlock width={CATEGORY_TILE_WIDTH - 12} height={26} radius={5} />
                <SkeletonBlock width={(CATEGORY_TILE_WIDTH - 12) * 0.72} height={12} radius={5} style={styles.tileDiscount} />
                <SkeletonBlock width={CATEGORY_TILE_WIDTH - 12} height={58} radius={6} style={styles.tileImage} />
              </View>
            ))}
          </View>
          <SkeletonBlock width={210} height={16} style={styles.viewAll} />
        </View>
      </View>
    ))}
  </ScrollView>
);

export const CategoryProductsLoadingSkeleton = ({ count = 4 }) => (
  <ScrollView style={styles.productList} contentContainerStyle={styles.productContent} showsVerticalScrollIndicator={false}>
    {Array.from({ length: count }, (_, index) => (
      <View key={index} style={styles.productCard}>
        <View style={styles.productTop}>
          <SkeletonBlock width={110} height={110} radius={10} />
          <View style={styles.productDetails}>
            <SkeletonBlock width={PRODUCT_DETAILS_WIDTH * 0.9} height={17} radius={5} />
            <SkeletonBlock width={PRODUCT_DETAILS_WIDTH * 0.42} height={14} radius={5} style={styles.productUnit} />
            <SkeletonBlock width={PRODUCT_DETAILS_WIDTH * 0.55} height={16} radius={5} style={styles.productPrice} />
            <SkeletonBlock width={PRODUCT_DETAILS_WIDTH * 0.68} height={14} radius={5} style={styles.productDelivery} />
          </View>
        </View>
        <View style={styles.productActions}>
          <SkeletonBlock width={44} height={40} radius={10} />
          <SkeletonBlock width={SCREEN_WIDTH - 116} height={40} radius={10} />
        </View>
      </View>
    ))}
  </ScrollView>
);

export const OrdersLoadingSkeleton = ({ count = 3 }) => (
  <ScrollView contentContainerStyle={styles.ordersContent} showsVerticalScrollIndicator={false}>
    {Array.from({ length: count }, (_, index) => (
      <View key={index}>
        <SkeletonBlock width={118} height={27} radius={18} style={styles.orderDate} />
        <View style={styles.orderCard}>
          <SkeletonBlock width={SCREEN_WIDTH * 0.55} height={16} radius={5} />
          <SkeletonBlock width={SCREEN_WIDTH * 0.32} height={14} radius={5} style={styles.orderStatus} />
          <View style={styles.orderImages}>
            {[0, 1, 2, 3].map(item => <SkeletonBlock key={item} width={56} height={56} radius={8} />)}
          </View>
          <View style={styles.orderTimeline}>
            {[0, 1, 2].map(item => <SkeletonBlock key={item} width={SCREEN_WIDTH * 0.25} height={8} radius={5} />)}
          </View>
          <SkeletonBlock width={SCREEN_WIDTH - 60} height={38} radius={8} style={styles.orderButton} />
        </View>
      </View>
    ))}
  </ScrollView>
);

export const ProductGridLoadingSkeleton = ({ count = 6 }) => (
  <ScrollView contentContainerStyle={styles.gridContent} showsVerticalScrollIndicator={false}>
    {Array.from({ length: Math.ceil(count / 2) }, (_, row) => (
      <View key={row} style={styles.gridRow}>
        {[0, 1].map(column => (
          <View key={column} style={styles.gridCard}>
            <SkeletonBlock width={SCREEN_WIDTH * 0.39} height={112} radius={8} />
            <SkeletonBlock width={SCREEN_WIDTH * 0.35} height={16} radius={5} style={styles.gridName} />
            <SkeletonBlock width={SCREEN_WIDTH * 0.22} height={12} radius={5} style={styles.gridUnit} />
            <SkeletonBlock width={SCREEN_WIDTH * 0.27} height={16} radius={5} style={styles.gridPrice} />
            <SkeletonBlock width={SCREEN_WIDTH * 0.39} height={36} radius={8} style={styles.gridButton} />
          </View>
        ))}
      </View>
    ))}
  </ScrollView>
);

export const ProductRowsLoadingSkeleton = ({ count = 5 }) => (
  <ScrollView contentContainerStyle={styles.rowsContent} showsVerticalScrollIndicator={false}>
    {Array.from({ length: count }, (_, index) => (
      <View key={index} style={styles.listCard}>
        <SkeletonBlock width={72} height={72} radius={10} />
        <View style={styles.listDetails}>
          <SkeletonBlock width={SCREEN_WIDTH * 0.52} height={16} radius={5} />
          <SkeletonBlock width={SCREEN_WIDTH * 0.32} height={13} radius={5} style={styles.listUnit} />
          <SkeletonBlock width={SCREEN_WIDTH * 0.22} height={16} radius={5} style={styles.listPrice} />
        </View>
        <SkeletonBlock width={52} height={34} radius={8} />
      </View>
    ))}
  </ScrollView>
);

export const DetailLoadingSkeleton = ({ order = false }) => (
  <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
    <SkeletonBlock width={SCREEN_WIDTH - 32} height={order ? 112 : 90} radius={16} />
    <View style={styles.detailCard}>
      <SkeletonBlock width={SCREEN_WIDTH * 0.55} height={20} />
      <SkeletonBlock width={SCREEN_WIDTH * 0.38} height={15} style={styles.detailLine} />
      <SkeletonBlock width={SCREEN_WIDTH - 64} height={180} radius={12} style={styles.detailImage} />
      <SkeletonBlock width={SCREEN_WIDTH * 0.72} height={18} style={styles.detailLine} />
      <SkeletonBlock width={SCREEN_WIDTH * 0.44} height={18} style={styles.detailLine} />
    </View>
    {order && <View style={styles.detailCard}>
      <SkeletonBlock width={SCREEN_WIDTH * 0.45} height={18} />
      <SkeletonBlock width={SCREEN_WIDTH - 64} height={90} style={styles.detailLine} />
    </View>}
  </ScrollView>
);

export const SimplePageLoadingSkeleton = ({ count = 4, rowHeight = 72 }) => (
  <ScrollView contentContainerStyle={styles.simpleContent} showsVerticalScrollIndicator={false}>
    {Array.from({ length: count }, (_, index) => (
      <View key={index} style={styles.simpleCard}>
        <SkeletonBlock width={SCREEN_WIDTH - 64} height={16} />
        <SkeletonBlock width={SCREEN_WIDTH * 0.62} height={13} style={styles.simpleLine} />
        <SkeletonBlock width={SCREEN_WIDTH - 64} height={rowHeight} radius={10} style={styles.simpleBlock} />
      </View>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  homeContent: { paddingHorizontal: HORIZONTAL_PADDING, paddingTop: 16, paddingBottom: 32 },
  section: { marginTop: 24 },
  horizontalRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  categoriesContent: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 96 },
  categorySection: { marginTop: 24 },
  categoryPanel: { backgroundColor: '#F3F4F7', borderRadius: 12, padding: 9, marginTop: 11 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 7 },
  categoryTile: { width: '32.3%', minHeight: 118, backgroundColor: '#FFFFFF', borderRadius: 8, padding: 6 },
  tileDiscount: { marginTop: 4 },
  tileImage: { marginTop: 5 },
  viewAll: { marginTop: 12 },
  productList: { flex: 1, backgroundColor: '#F4F5FF' },
  productContent: { padding: 12 },
  productCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#EFF3F5' },
  productTop: { flexDirection: 'row' },
  productDetails: { flex: 1, marginLeft: 12, alignItems: 'flex-start' },
  productUnit: { marginTop: 7 },
  productPrice: { marginTop: 11 },
  productDelivery: { marginTop: 10 },
  productActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  ordersContent: { paddingHorizontal: 16, paddingBottom: 28 },
  orderDate: { marginTop: 12, marginBottom: 10 },
  orderCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#ECEEF4' },
  orderStatus: { marginTop: 8 },
  orderImages: { flexDirection: 'row', gap: 8, marginTop: 16 },
  orderTimeline: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  orderButton: { marginTop: 16 },
  gridContent: { padding: 12, paddingBottom: 28 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between' },
  gridCard: { width: '48.5%', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 11, marginBottom: 12, borderWidth: 1, borderColor: '#ECEEF4' },
  gridName: { marginTop: 8 },
  gridUnit: { marginTop: 6 },
  gridPrice: { marginTop: 8 },
  gridButton: { marginTop: 10 },
  rowsContent: { padding: 12, paddingBottom: 28 },
  listCard: { minHeight: 96, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#ECEEF4' },
  listDetails: { flex: 1, alignItems: 'flex-start', marginLeft: 12 },
  listUnit: { marginTop: 7 },
  listPrice: { marginTop: 8 },
  detailContent: { padding: 16, paddingBottom: 32 },
  detailCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginTop: 14, borderWidth: 1, borderColor: '#ECEEF4' },
  detailLine: { marginTop: 12 },
  detailImage: { marginTop: 18 },
  simpleContent: { padding: 16, paddingBottom: 28 },
  simpleCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#ECEEF4' },
  simpleLine: { marginTop: 8 },
  simpleBlock: { marginTop: 14 },
});
