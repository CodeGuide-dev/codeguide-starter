import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { desc, gte, lte, ilike, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Parse query parameters
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const vendor = searchParams.get('vendor');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const sortBy = searchParams.get('sortBy') || 'date';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Validate pagination parameters
        const validatedPage = Math.max(1, page);
        const validatedLimit = Math.min(100, Math.max(1, limit)); // Max 100 items per page
        const offset = (validatedPage - 1) * validatedLimit;

        // Build where conditions
        const conditions = [];

        if (vendor) {
            conditions.push(ilike(schema.invoice.vendor, `%${vendor}%`));
        }

        if (startDate) {
            const start = new Date(startDate);
            if (!isNaN(start.getTime())) {
                conditions.push(gte(schema.invoice.date, start));
            }
        }

        if (endDate) {
            const end = new Date(endDate);
            if (!isNaN(end.getTime())) {
                // Set to end of day
                end.setHours(23, 59, 59, 999);
                conditions.push(lte(schema.invoice.date, end));
            }
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Build order clause
        let orderClause;
        switch (sortBy) {
            case 'invoiceNumber':
                orderClause = sortOrder === 'asc' 
                    ? schema.invoice.invoiceNumber 
                    : desc(schema.invoice.invoiceNumber);
                break;
            case 'vendor':
                orderClause = sortOrder === 'asc' 
                    ? schema.invoice.vendor 
                    : desc(schema.invoice.vendor);
                break;
            case 'totalAmount':
                orderClause = sortOrder === 'asc' 
                    ? schema.invoice.totalAmount 
                    : desc(schema.invoice.totalAmount);
                break;
            default: // date
                orderClause = sortOrder === 'asc' 
                    ? schema.invoice.date 
                    : desc(schema.invoice.date);
        }

        // Get total count for pagination
        const [{ count }] = await db
            .select({ count: schema.invoice.id })
            .from(schema.invoice)
            .where(whereClause);

        // Get invoices with pagination
        const invoices = await db
            .select()
            .from(schema.invoice)
            .where(whereClause)
            .orderBy(orderClause)
            .limit(validatedLimit)
            .offset(offset);

        // Transform the response to include proper numeric values
        const transformedInvoices = invoices.map(invoice => ({
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            date: invoice.date,
            vendor: invoice.vendor,
            totalAmount: parseFloat(invoice.totalAmount),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        }));

        // Calculate pagination metadata
        const totalPages = Math.ceil(parseInt(count) / validatedLimit);
        const hasNextPage = validatedPage < totalPages;
        const hasPrevPage = validatedPage > 1;

        return NextResponse.json({
            invoices: transformedInvoices,
            pagination: {
                page: validatedPage,
                limit: validatedLimit,
                total: parseInt(count),
                totalPages,
                hasNextPage,
                hasPrevPage
            },
            filters: {
                vendor,
                startDate,
                endDate,
                sortBy,
                sortOrder
            }
        });

    } catch (error) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoices' },
            { status: 500 }
        );
    }
}