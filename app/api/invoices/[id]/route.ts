import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';

interface Params {
    id: string;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const { id } = params;

        // Validate ID format (should be UUID)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return NextResponse.json(
                { error: 'Invalid invoice ID format' },
                { status: 400 }
            );
        }

        // Get invoice details
        const invoice = await db
            .select()
            .from(schema.invoice)
            .where(eq(schema.invoice.id, id))
            .limit(1);

        if (invoice.length === 0) {
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            );
        }

        // Get invoice line items
        const lineItems = await db
            .select()
            .from(schema.invoiceItem)
            .where(eq(schema.invoiceItem.invoiceId, id))
            .orderBy(schema.invoiceItem.createdAt);

        // Transform the response
        const invoiceData = invoice[0];
        const transformedInvoice = {
            id: invoiceData.id,
            invoiceNumber: invoiceData.invoiceNumber,
            date: invoiceData.date,
            vendor: invoiceData.vendor,
            totalAmount: parseFloat(invoiceData.totalAmount),
            createdAt: invoiceData.createdAt,
            updatedAt: invoiceData.updatedAt,
            lineItems: lineItems.map(item => ({
                id: item.id,
                description: item.description,
                quantity: parseFloat(item.quantity),
                unitPrice: parseFloat(item.unitPrice),
                lineTotal: parseFloat(item.lineTotal),
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }))
        };

        return NextResponse.json({
            invoice: transformedInvoice
        });

    } catch (error) {
        console.error('Error fetching invoice details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoice details' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const { id } = params;

        // Validate ID format (should be UUID)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return NextResponse.json(
                { error: 'Invalid invoice ID format' },
                { status: 400 }
            );
        }

        // Check if invoice exists
        const existingInvoice = await db
            .select({ id: schema.invoice.id })
            .from(schema.invoice)
            .where(eq(schema.invoice.id, id))
            .limit(1);

        if (existingInvoice.length === 0) {
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            );
        }

        // Delete invoice (line items will be deleted due to CASCADE)
        await db
            .delete(schema.invoice)
            .where(eq(schema.invoice.id, id));

        return NextResponse.json({
            message: 'Invoice deleted successfully',
            deletedId: id
        });

    } catch (error) {
        console.error('Error deleting invoice:', error);
        return NextResponse.json(
            { error: 'Failed to delete invoice' },
            { status: 500 }
        );
    }
}