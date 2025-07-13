import { PrintButton } from '@/components/dashboard/PrintButton';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PDFDownloadButton } from '@/components/receipts/PDFDownloadButton';

export default async function ReceiptPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <p className="p-8">Access Denied. Please log in to view receipts.</p>;
  }

  const sale = await prisma.sale.findUnique({
    where: { id: params.id },
    include: {
      saleItems: {
        include: {
          product: true,
        },
      },
      customer: true, // Include full customer details
    },
  });

  if (!sale) {
    return <p className="p-8">Sale not found.</p>;
  }

  return (
    <div className="bg-white text-black p-8 max-w-2xl mx-auto print-container">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Your Shop Name</h1>
        <p>Aburi, Eastern Region, Ghana</p>
        <p>Date: {new Date(sale.createdAt).toLocaleString()}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold border-b pb-1">Sale Receipt</h2>
        <p className="text-sm">Sale ID: {sale.id}</p>
        <p className="text-sm">Customer: {sale.customer?.name || 'N/A'}</p>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Item</th>
            <th className="text-center py-2">Qty</th>
            <th className="text-right py-2">Price</th>
            <th className="text-right py-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {sale.saleItems.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-2">{item.product.name}</td>
              <td className="text-center py-2">{item.quantity}</td>
              <td className="text-right py-2">GHS {item.price.toFixed(2)}</td>
              <td className="text-right py-2">GHS {(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-1/2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>GHS {sale.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-12">
        <p>Thank you for your purchase!</p>
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <PrintButton />
        <PDFDownloadButton sale={sale} />
      </div>
    </div>
  );
}