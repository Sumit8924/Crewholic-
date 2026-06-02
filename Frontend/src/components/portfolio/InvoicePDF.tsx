/* eslint-disable prettier/prettier */
// Create a new file: components/InvoicePDF.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 30, backgroundColor: '#ffffff' },
    header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    section: { marginBottom: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
});

const InvoicePDF = ({ order, user }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text>CREWHOLIC</Text>
                <Text>TAX INVOICE</Text>
            </View>

            <View style={styles.section}>
                <Text>Invoice To: {order.shippingAddress.name}</Text>
                <Text>Order Number: {order.orderNumber}</Text>
                <Text>Date: {formatDate(order.date)}</Text>
                <Text>Payment Method: {order.paymentMethod}</Text>
            </View>

            {/* Add more fields as needed */}
        </Page>
    </Document>
);

export default InvoicePDF;