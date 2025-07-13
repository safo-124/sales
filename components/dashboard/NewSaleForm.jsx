'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';

export function NewSaleForm({ products, customers }) {
  const [saleItems, setSaleItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    if (!debouncedSearchQuery) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, products]);

  const handleAddItem = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product || quantity <= 0) return;

    const existingItem = saleItems.find(item => item.productId === product.id);
    if (existingItem) {
      setSaleItems(saleItems.map(item =>
        item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setSaleItems([...saleItems, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
      }]);
    }
    setSelectedProductId('');
    setQuantity(1);
  };

  const handleRemoveItem = (productId) => {
    setSaleItems(saleItems.filter(item => item.productId !== productId));
  };

  const total = saleItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleRecordSale = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: total,
          saleItems: saleItems.map(({ name, ...item }) => item),
          customerId: selectedCustomerId || null,
        }),
      });

      if (res.ok) {
        toast.success("Sale recorded successfully!");
        router.push('/dashboard/sales');
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.message || `Failed to record sale.`);
      }
    } catch (error) {
        toast.error("An unexpected error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Record a New Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search for a product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
               <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Customer (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {filteredProducts.filter(p => p.stock > 0).map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (Stock: {product.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                min="1"
              />
            </div>
            <Button onClick={handleAddItem} className="w-full">Add to Sale</Button>
          </div>
          
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="w-[20px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saleItems.map(item => (
                  <TableRow key={item.productId}>
                    <TableCell>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">GHS {item.price.toFixed(2)} ea.</p>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">GHS {(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveItem(item.productId)}>
                        X
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <h2 className="text-2xl font-bold">Total: GHS {total.toFixed(2)}</h2>
          <Button onClick={handleRecordSale} disabled={isLoading || saleItems.length === 0} size="lg" className="w-full md:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Recording...' : 'Record Sale'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}