'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Link from 'next/link'; // Import Link

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  async function fetchCustomers() {
    setIsFetching(true);
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        setCustomers(await res.json());
      } else {
        toast.error("Could not load customers.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    });

    setIsLoading(false);

    if (res.ok) {
      toast.success('Customer added successfully!');
      setName('');
      setPhone('');
      fetchCustomers();
    } else {
      const data = await res.json();
      toast.error(data.message || 'Failed to add customer.');
    }
  };

  return (
    <div className="p-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Customer</CardTitle>
            <CardDescription>Add a new customer to your records.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Customer Name</label>
                <Input
                  id="name"
                  placeholder="e.g., John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number (Optional)</label>
                <Input
                  id="phone"
                  placeholder="e.g., 024 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Adding...' : 'Add Customer'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Customers</CardTitle>
            <CardDescription>A list of all your customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">Loading customers...</TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/customers/${customer.id}`} className="hover:underline">
                          {customer.name}
                        </Link>
                      </TableCell>
                      <TableCell>{customer.phone || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}