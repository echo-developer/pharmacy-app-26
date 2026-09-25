import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Strip HTML tags and decode common HTML entities
const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')       // <br> → newline
    .replace(/<\/p>/gi, '\n')             // </p> → newline
    .replace(/<\/h[1-6]>/gi, '\n')        // </h1>…</h6> → newline
    .replace(/<[^>]+>/g, '')              // remove all remaining tags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, '\n\n')          // collapse 3+ newlines to 2
    .trim();
};

const ProductDescription = ({
  title = 'Description',
  description = '',
}) => {
  const cleanText = stripHtml(description);

  if (!cleanText) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{cleanText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#16161D',
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4F514E',
    fontWeight: '400',
  },
});

export default ProductDescription;