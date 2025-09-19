'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { 
    FileText, 
    Filter, 
    RefreshCw, 
    Calendar, 
    DollarSign, 
    Building, 
    Eye,
    ChevronUp,
    ChevronDown,
    Search,
    Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import UploadInvoiceForm from './UploadInvoiceForm';

interface Invoice {
    id: string;
    invoiceNumber: string;
    date: string;
    vendor: string;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}

interface InvoiceDetails extends Invoice {
    lineItems: {
        id: string;
        description: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        createdAt: string;
        updatedAt: string;
    }[];
}

interface FilterParams {
    vendor?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

const ITEMS_PER_PAGE = 10;

export default function InvoiceDashboard() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalInvoices, setTotalInvoices] = useState(0);
    const [showUploadForm, setShowUploadForm] = useState(false);
    
    // Filter states
    const [filters, setFilters] = useState<FilterParams>({
        sortBy: 'date',
        sortOrder: 'desc'
    });
    const [tempFilters, setTempFilters] = useState<FilterParams>({});

    const fetchInvoices = useCallback(async (page = 1, filterParams = filters) => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                ...(filterParams.vendor && { vendor: filterParams.vendor }),
                ...(filterParams.startDate && { startDate: filterParams.startDate }),
                ...(filterParams.endDate && { endDate: filterParams.endDate }),
                ...(filterParams.sortBy && { sortBy: filterParams.sortBy }),
                ...(filterParams.sortOrder && { sortOrder: filterParams.sortOrder }),
            });

            const response = await fetch(`/api/invoices?${params}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch invoices');
            }

            const data = await response.json();
            setInvoices(data.invoices || []);
            setCurrentPage(data.pagination?.page || 1);
            setTotalPages(data.pagination?.totalPages || 1);
            setTotalInvoices(data.pagination?.total || 0);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
            setInvoices([]);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    const fetchInvoiceDetails = async (invoiceId: string) => {
        try {
            setIsLoadingDetails(true);
            const response = await fetch(`/api/invoices/${invoiceId}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch invoice details');
            }

            const data = await response.json();
            setSelectedInvoice(data.invoice);
        } catch (err) {
            console.error('Failed to fetch invoice details:', err);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    useEffect(() => {
        fetchInvoices(currentPage, filters);
    }, [fetchInvoices, currentPage, filters]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchInvoices(currentPage, filters);
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchInvoices, currentPage, filters]);

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters(tempFilters);
        setCurrentPage(1);
    };

    const handleFilterReset = () => {
        const resetFilters = { sortBy: 'date', sortOrder: 'desc' as const };
        setTempFilters(resetFilters);
        setFilters(resetFilters);
        setCurrentPage(1);
    };

    const handleSort = (column: string) => {
        const newOrder = filters.sortBy === column && filters.sortOrder === 'desc' ? 'asc' : 'desc';
        const newFilters = { ...filters, sortBy: column, sortOrder: newOrder };
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleUploadSuccess = (invoice: Invoice) => {
        setShowUploadForm(false);
        // Refresh the invoice list
        fetchInvoices(1, filters);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getSortIcon = (column: string) => {
        if (filters.sortBy !== column) return null;
        return filters.sortOrder === 'desc' ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />;
    };

    // Calculate summary statistics
    const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
    const averageAmount = totalInvoices > 0 ? totalAmount / totalInvoices : 0;

    // Prepare chart data
    const monthlyData = React.useMemo(() => {
        const monthlyTotals: { [key: string]: number } = {};
        invoices.forEach(invoice => {
            const month = format(new Date(invoice.date), 'MMM yyyy');
            monthlyTotals[month] = (monthlyTotals[month] || 0) + invoice.totalAmount;
        });
        
        return Object.entries(monthlyTotals).map(([month, total]) => ({
            month,
            total
        }));
    }, [invoices]);

    const vendorData = React.useMemo(() => {
        const vendorTotals: { [key: string]: number } = {};
        invoices.forEach(invoice => {
            vendorTotals[invoice.vendor] = (vendorTotals[invoice.vendor] || 0) + invoice.totalAmount;
        });
        
        return Object.entries(vendorTotals)
            .map(([vendor, total]) => ({ vendor, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5); // Top 5 vendors
    }, [invoices]);

    const chartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Invoice Dashboard</h1>
                    <p className="text-muted-foreground">Manage and analyze your invoices</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchInvoices(currentPage, filters)}
                    >
                        <RefreshCw className="size-4 mr-2" />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setShowUploadForm(true)}
                        size="sm"
                    >
                        <Plus className="size-4 mr-2" />
                        Upload Invoice
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                        <FileText className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalInvoices}</div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                        <DollarSign className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
                        <Calendar className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(averageAmount)}</div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Building className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {invoices.filter(inv => 
                                new Date(inv.date).getMonth() === new Date().getMonth()
                            ).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Trends</CardTitle>
                        <CardDescription>Invoice amounts over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                total: {
                                    label: "Total Amount",
                                    color: "hsl(var(--chart-1))",
                                },
                            }}
                            className="h-80"
                        >
                            <AreaChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                    formatter={(value) => [formatCurrency(Number(value)), "Total"]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="var(--color-total)"
                                    fill="var(--color-total)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Vendors</CardTitle>
                        <CardDescription>Top 5 vendors by amount</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                total: {
                                    label: "Total Amount",
                                    color: "hsl(var(--chart-2))",
                                },
                            }}
                            className="h-80"
                        >
                            <BarChart data={vendorData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="vendor" />
                                <YAxis />
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                    formatter={(value) => [formatCurrency(Number(value)), "Total"]}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="var(--color-total)"
                                />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="size-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFilterSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="vendor-filter">Vendor</Label>
                                <Input
                                    id="vendor-filter"
                                    placeholder="Search vendor..."
                                    value={tempFilters.vendor || ''}
                                    onChange={(e) => setTempFilters({...tempFilters, vendor: e.target.value})}
                                />
                            </div>
                            <div>
                                <Label htmlFor="start-date">Start Date</Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={tempFilters.startDate || ''}
                                    onChange={(e) => setTempFilters({...tempFilters, startDate: e.target.value})}
                                />
                            </div>
                            <div>
                                <Label htmlFor="end-date">End Date</Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={tempFilters.endDate || ''}
                                    onChange={(e) => setTempFilters({...tempFilters, endDate: e.target.value})}
                                />
                            </div>
                            <div>
                                <Label htmlFor="sort-by">Sort By</Label>
                                <Select 
                                    value={tempFilters.sortBy || 'date'} 
                                    onValueChange={(value) => setTempFilters({...tempFilters, sortBy: value})}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date">Date</SelectItem>
                                        <SelectItem value="vendor">Vendor</SelectItem>
                                        <SelectItem value="totalAmount">Amount</SelectItem>
                                        <SelectItem value="invoiceNumber">Invoice Number</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" size="sm">
                                <Search className="size-4 mr-2" />
                                Apply Filters
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={handleFilterReset}>
                                Reset
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Invoice List */}
            <Card>
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>
                        {totalInvoices > 0 ? `Showing ${invoices.length} of ${totalInvoices} invoices` : 'No invoices found'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {isLoading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : invoices.length > 0 ? (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead 
                                            className="cursor-pointer" 
                                            onClick={() => handleSort('invoiceNumber')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Invoice #
                                                {getSortIcon('invoiceNumber')}
                                            </div>
                                        </TableHead>
                                        <TableHead 
                                            className="cursor-pointer" 
                                            onClick={() => handleSort('date')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Date
                                                {getSortIcon('date')}
                                            </div>
                                        </TableHead>
                                        <TableHead 
                                            className="cursor-pointer" 
                                            onClick={() => handleSort('vendor')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Vendor
                                                {getSortIcon('vendor')}
                                            </div>
                                        </TableHead>
                                        <TableHead 
                                            className="cursor-pointer text-right" 
                                            onClick={() => handleSort('totalAmount')}
                                        >
                                            <div className="flex items-center justify-end gap-1">
                                                Amount
                                                {getSortIcon('totalAmount')}
                                            </div>
                                        </TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell className="font-medium">
                                                {invoice.invoiceNumber}
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(invoice.date), 'MMM d, yyyy')}
                                            </TableCell>
                                            <TableCell>{invoice.vendor}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(invoice.totalAmount)}
                                            </TableCell>
                                            <TableCell>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => fetchInvoiceDetails(invoice.id)}
                                                        >
                                                            <Eye className="size-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>Invoice Details</DialogTitle>
                                                            <DialogDescription>
                                                                Invoice #{invoice.invoiceNumber}
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        
                                                        {isLoadingDetails ? (
                                                            <div className="space-y-4">
                                                                <Skeleton className="h-6 w-1/3" />
                                                                <Skeleton className="h-4 w-1/2" />
                                                                <Skeleton className="h-32 w-full" />
                                                            </div>
                                                        ) : selectedInvoice ? (
                                                            <div className="space-y-6">
                                                                {/* Invoice Header */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <Label>Invoice Number</Label>
                                                                        <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                                                                    </div>
                                                                    <div>
                                                                        <Label>Date</Label>
                                                                        <p className="font-medium">
                                                                            {format(new Date(selectedInvoice.date), 'MMMM d, yyyy')}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <Label>Vendor</Label>
                                                                        <p className="font-medium">{selectedInvoice.vendor}</p>
                                                                    </div>
                                                                    <div>
                                                                        <Label>Total Amount</Label>
                                                                        <p className="font-bold text-lg">
                                                                            {formatCurrency(selectedInvoice.totalAmount)}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Line Items */}
                                                                {selectedInvoice.lineItems.length > 0 && (
                                                                    <div>
                                                                        <Label className="text-base">Line Items</Label>
                                                                        <div className="mt-2 border rounded-lg overflow-hidden">
                                                                            <Table>
                                                                                <TableHeader>
                                                                                    <TableRow>
                                                                                        <TableHead>Description</TableHead>
                                                                                        <TableHead className="text-right">Qty</TableHead>
                                                                                        <TableHead className="text-right">Unit Price</TableHead>
                                                                                        <TableHead className="text-right">Total</TableHead>
                                                                                    </TableRow>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                    {selectedInvoice.lineItems.map((item) => (
                                                                                        <TableRow key={item.id}>
                                                                                            <TableCell>{item.description}</TableCell>
                                                                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                                                                            <TableCell className="text-right">
                                                                                                {formatCurrency(item.unitPrice)}
                                                                                            </TableCell>
                                                                                            <TableCell className="text-right font-medium">
                                                                                                {formatCurrency(item.lineTotal)}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : null}
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-4">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious 
                                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                />
                                            </PaginationItem>
                                            
                                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                                const pageNum = Math.max(1, currentPage - 2) + i;
                                                if (pageNum > totalPages) return null;
                                                
                                                return (
                                                    <PaginationItem key={pageNum}>
                                                        <PaginationLink
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            isActive={pageNum === currentPage}
                                                            className="cursor-pointer"
                                                        >
                                                            {pageNum}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            })}
                                            
                                            <PaginationItem>
                                                <PaginationNext 
                                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <FileText className="size-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
                            <p className="text-muted-foreground mb-4">
                                Get started by uploading your first invoice.
                            </p>
                            <Button onClick={() => setShowUploadForm(true)}>
                                <Plus className="size-4 mr-2" />
                                Upload Invoice
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Upload Form Dialog */}
            <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Upload New Invoice</DialogTitle>
                        <DialogDescription>
                            Upload an invoice image or PDF for automatic processing
                        </DialogDescription>
                    </DialogHeader>
                    <UploadInvoiceForm
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={(error) => {
                            console.error('Upload error:', error);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}