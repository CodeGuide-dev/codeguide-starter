import { createWorker, Worker } from 'tesseract.js';

export interface InvoiceData {
    invoiceNumber: string | null;
    date: Date | null;
    vendor: string | null;
    totalAmount: number | null;
    lineItems: InvoiceLineItem[];
}

export interface InvoiceLineItem {
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
}

let worker: Worker | null = null;

async function initializeWorker() {
    if (!worker) {
        worker = await createWorker('eng', 1, {
            logger: m => console.log(m)
        });
        await worker.setParameters({
            tessedit_pageseg_mode: '6', // Uniform block of text
            tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,$/()-:',
        });
    }
    return worker;
}

export async function extractText(imageBuffer: Buffer): Promise<string> {
    try {
        const workerInstance = await initializeWorker();
        const { data: { text } } = await workerInstance.recognize(imageBuffer);
        return text.trim();
    } catch (error) {
        console.error('OCR extraction failed:', error);
        throw new Error('Failed to extract text from image');
    }
}

export function parseInvoiceData(text: string): InvoiceData {
    const result: InvoiceData = {
        invoiceNumber: null,
        date: null,
        vendor: null,
        totalAmount: null,
        lineItems: []
    };

    try {
        // Extract invoice number - look for patterns like "Invoice #12345", "INV-12345", etc.
        const invoiceNumberRegex = /(?:invoice\s*#?|inv[-#]?)\s*:?\s*([A-Z0-9-]+)/i;
        const invoiceNumberMatch = text.match(invoiceNumberRegex);
        if (invoiceNumberMatch) {
            result.invoiceNumber = invoiceNumberMatch[1].trim();
        }

        // Extract date - look for various date formats
        const dateRegex = /(?:date|invoice\s+date|date\s+issued)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}|\w+\s+\d{1,2},?\s+\d{4})/i;
        const dateMatch = text.match(dateRegex);
        if (dateMatch) {
            const dateStr = dateMatch[1].trim();
            const parsedDate = new Date(dateStr);
            if (!isNaN(parsedDate.getTime())) {
                result.date = parsedDate;
            }
        }

        // Extract vendor/company name - usually at the top of the invoice
        const vendorRegex = /^([A-Z][A-Z\s&.,'-]+(?:LLC|INC|CORP|LTD|CO|COMPANY)?)/im;
        const vendorMatch = text.match(vendorRegex);
        if (vendorMatch) {
            result.vendor = vendorMatch[1].trim();
        } else {
            // Fallback - look for "from" or "bill from" patterns
            const billFromRegex = /(?:bill\s+from|from)\s*:?\s*([A-Z][A-Z\s&.,'-]+)/i;
            const billFromMatch = text.match(billFromRegex);
            if (billFromMatch) {
                result.vendor = billFromMatch[1].trim();
            }
        }

        // Extract total amount - look for patterns like "Total: $123.45", "Amount Due: $123.45"
        const totalRegex = /(?:total|amount\s+due|grand\s+total|balance\s+due)\s*:?\s*\$?(\d+(?:[,\.]\d{3})*\.?\d{0,2})/i;
        const totalMatch = text.match(totalRegex);
        if (totalMatch) {
            const amountStr = totalMatch[1].replace(/,/g, '');
            result.totalAmount = parseFloat(amountStr);
        }

        // Extract line items - look for tabular data with description, quantity, price patterns
        const lines = text.split('\n');
        const lineItems: InvoiceLineItem[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Pattern for line items: description followed by quantity, unit price, and total
            // Examples: "Product Name 2 $10.00 $20.00" or "Service Description 1.5 $50.00 $75.00"
            const lineItemRegex = /^(.+?)\s+(\d*\.?\d+)\s+\$?(\d+(?:\.\d{2})?)\s+\$?(\d+(?:\.\d{2})?)$/;
            const match = line.match(lineItemRegex);
            
            if (match) {
                const description = match[1].trim();
                const quantity = parseFloat(match[2]);
                const unitPrice = parseFloat(match[3]);
                const lineTotal = parseFloat(match[4]);
                
                // Validate that the math checks out (with some tolerance for rounding)
                if (Math.abs(quantity * unitPrice - lineTotal) < 0.01) {
                    lineItems.push({
                        description,
                        quantity,
                        unitPrice,
                        lineTotal
                    });
                }
            }
        }

        result.lineItems = lineItems;

        // Validate that we have at least some essential information
        if (!result.invoiceNumber && !result.vendor && !result.totalAmount) {
            throw new Error('Could not extract essential invoice information');
        }

        return result;
    } catch (error) {
        console.error('Invoice parsing failed:', error);
        throw new Error('Failed to parse invoice data from extracted text');
    }
}

export async function processInvoiceImage(imageBuffer: Buffer): Promise<InvoiceData> {
    const text = await extractText(imageBuffer);
    return parseInvoiceData(text);
}

export async function cleanup() {
    if (worker) {
        await worker.terminate();
        worker = null;
    }
}