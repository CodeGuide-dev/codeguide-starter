import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { processInvoiceImage } from '@/lib/services/ocrService';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('invoice') as File;
        
        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only images (JPEG, PNG, GIF) and PDF files are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 5MB.' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Process image with OCR
        let invoiceData;
        try {
            invoiceData = await processInvoiceImage(buffer);
        } catch (ocrError) {
            console.error('OCR processing failed:', ocrError);
            return NextResponse.json(
                { error: 'Failed to extract invoice data from the uploaded file. Please ensure the image is clear and contains valid invoice information.' },
                { status: 400 }
            );
        }

        // Validate extracted data
        if (!invoiceData.invoiceNumber || !invoiceData.vendor || invoiceData.totalAmount === null) {
            return NextResponse.json(
                { error: 'Could not extract essential invoice information (invoice number, vendor, or total amount). Please verify the image quality and try again.' },
                { status: 400 }
            );
        }

        // Generate unique invoice number if extraction failed
        let finalInvoiceNumber = invoiceData.invoiceNumber;
        if (!finalInvoiceNumber) {
            finalInvoiceNumber = `INV-${Date.now()}`;
        }

        try {
            // Insert invoice into database
            const [invoice] = await db
                .insert(schema.invoice)
                .values({
                    invoiceNumber: finalInvoiceNumber,
                    date: invoiceData.date || new Date(),
                    vendor: invoiceData.vendor!,
                    totalAmount: invoiceData.totalAmount!.toString(),
                })
                .returning();

            // Insert line items if any
            if (invoiceData.lineItems.length > 0) {
                await db
                    .insert(schema.invoiceItem)
                    .values(
                        invoiceData.lineItems.map(item => ({
                            invoiceId: invoice.id,
                            description: item.description,
                            quantity: item.quantity.toString(),
                            unitPrice: item.unitPrice.toString(),
                            lineTotal: item.lineTotal.toString(),
                        }))
                    );
            }

            // Return success response with created invoice
            return NextResponse.json({
                message: 'Invoice uploaded and processed successfully',
                invoice: {
                    id: invoice.id,
                    invoiceNumber: invoice.invoiceNumber,
                    date: invoice.date,
                    vendor: invoice.vendor,
                    totalAmount: parseFloat(invoice.totalAmount),
                    lineItems: invoiceData.lineItems
                }
            }, { status: 201 });

        } catch (dbError: any) {
            console.error('Database error:', dbError);
            
            // Handle duplicate invoice number
            if (dbError.code === '23505' && dbError.constraint?.includes('invoice_number_unique')) {
                return NextResponse.json(
                    { error: 'An invoice with this number already exists.' },
                    { status: 409 }
                );
            }
            
            return NextResponse.json(
                { error: 'Failed to save invoice to database' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Upload processing error:', error);
        return NextResponse.json(
            { error: 'Internal server error during file processing' },
            { status: 500 }
        );
    }
}