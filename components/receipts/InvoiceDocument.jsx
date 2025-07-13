'use client';

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register a font. You can download fonts from Google Fonts.
// This is optional but recommended for better text rendering.
Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  shopName: {
    fontSize: 24,
    fontFamily: 'Oswald',
    color: 'black',
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 3,
    marginBottom: 10,
  },
  text: {
    fontSize: 11,
    marginBottom: 3,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    flexDirection: "row"
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#E4E4E4',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 10,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 10,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10
  },
  totalSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: 'grey',
    fontSize: 10,
  }
});

export function InvoiceDocument({ sale }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.shopName}>Your Shop Name</Text>
          <Text style={styles.text}>Aburi, Eastern Region, Ghana</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Invoice</Text>
          <Text style={styles.text}>Invoice ID: {sale.id}</Text>
          <Text style={styles.text}>Date: {new Date(sale.createdAt).toLocaleString()}</Text>
          <Text style={styles.text}>Customer: {sale.customer?.name || 'N/A'}</Text>
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, width: '40%' }}><Text>Item</Text></View>
            <View style={{ ...styles.tableColHeader, width: '20%', textAlign: 'center' }}><Text>Quantity</Text></View>
            <View style={{ ...styles.tableColHeader, width: '20%', textAlign: 'right' }}><Text>Price</Text></View>
            <View style={{ ...styles.tableColHeader, width: '20%', textAlign: 'right' }}><Text>Subtotal</Text></View>
          </View>
          {/* Table Rows */}
          {sale.saleItems.map(item => (
            <View style={styles.tableRow} key={item.id}>
              <View style={{ ...styles.tableCol, width: '40%' }}><Text>{item.product.name}</Text></View>
              <View style={{ ...styles.tableCol, width: '20%', textAlign: 'center' }}><Text>{item.quantity}</Text></View>
              <View style={{ ...styles.tableCol, width: '20%', textAlign: 'right' }}><Text>GHS {item.price.toFixed(2)}</Text></View>
              <View style={{ ...styles.tableCol, width: '20%', textAlign: 'right' }}><Text>GHS {(item.quantity * item.price).toFixed(2)}</Text></View>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
            <Text style={styles.totalText}>Total: GHS {sale.total.toFixed(2)}</Text>
        </View>

        <Text style={styles.footer}>Thank you for your purchase!</Text>
      </Page>
    </Document>
  );
}