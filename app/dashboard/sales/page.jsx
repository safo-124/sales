// src/app/dashboard/sales/page.jsx
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  async function getSales() {
    const res = await fetch('http://localhost:3000/api/sales', {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch sales');
    }
    return res.json();
  }
  
  export default async function SalesHistoryPage() {
    const sales = await getSales();
  
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Sale ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="w-[100px]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-mono">{sale.id}</TableCell>
                    <TableCell>
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      GHS {sale.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger>View</AccordionTrigger>
                          <AccordionContent>
                            <ul>
                              {sale.saleItems.map((item) => (
                                <li key={item.id}>
                                  {item.product.name} - ({item.quantity} x GHS {item.price.toFixed(2)})
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }