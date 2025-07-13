'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoiceDocument } from './InvoiceDocument';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

export function PDFDownloadButton({ sale }) {
  if (!sale) return null;

  return (
    <div className="no-print">
        <PDFDownloadLink
            document={<InvoiceDocument sale={sale} />}
            fileName={`invoice_${sale.id}.pdf`}
        >
        {({ blob, url, loading, error }) => (
            <Button disabled={loading}>
                {loading ? 'Generating PDF...' : (
                    <>
                        <FileDown className="mr-2 h-4 w-4" />
                        Download PDF
                    </>
                )}
            </Button>
        )}
        </PDFDownloadLink>
    </div>
  );
}