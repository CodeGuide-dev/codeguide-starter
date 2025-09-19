'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadInvoiceFormProps {
    onUploadSuccess?: (invoice: any) => void;
    onUploadError?: (error: string) => void;
}

export default function UploadInvoiceForm({ 
    onUploadSuccess, 
    onUploadError 
}: UploadInvoiceFormProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validateFile = (file: File): string | null => {
        if (!allowedTypes.includes(file.type)) {
            return 'Invalid file type. Only images (JPEG, PNG, GIF) and PDF files are allowed.';
        }
        if (file.size > maxSize) {
            return 'File too large. Maximum size is 5MB.';
        }
        return null;
    };

    const resetForm = () => {
        setSelectedFile(null);
        setUploadProgress(0);
        setUploadStatus('idle');
        setStatusMessage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileSelect = useCallback((file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setUploadStatus('error');
            setStatusMessage(validationError);
            onUploadError?.(validationError);
            return;
        }

        setSelectedFile(file);
        setUploadStatus('idle');
        setStatusMessage('');
    }, [onUploadError]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    }, [handleFileSelect]);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const simulateProgress = () => {
        setUploadProgress(10);
        
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + Math.random() * 15;
            });
        }, 200);

        return interval;
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadStatus('idle');
        setStatusMessage('Processing invoice...');
        
        const progressInterval = simulateProgress();

        try {
            const formData = new FormData();
            formData.append('invoice', selectedFile);

            const response = await fetch('/api/invoices/upload', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            const data = await response.json();

            if (response.ok) {
                setUploadStatus('success');
                setStatusMessage('Invoice uploaded and processed successfully!');
                onUploadSuccess?.(data.invoice);
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    resetForm();
                }, 3000);
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            clearInterval(progressInterval);
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            setUploadStatus('error');
            setStatusMessage(errorMessage);
            setUploadProgress(0);
            onUploadError?.(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const getStatusIcon = () => {
        switch (uploadStatus) {
            case 'success':
                return <CheckCircle className="size-4 text-green-600" />;
            case 'error':
                return <AlertCircle className="size-4 text-destructive" />;
            default:
                return <FileText className="size-4 text-muted-foreground" />;
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Upload className="size-5" />
                    Upload Invoice
                </CardTitle>
                <CardDescription>
                    Upload an image or PDF of your invoice for automatic data extraction
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Drag and Drop Zone */}
                <div
                    className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                        isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                        isUploading && "pointer-events-none opacity-50"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={allowedTypes.join(',')}
                        onChange={handleFileInputChange}
                        className="hidden"
                        disabled={isUploading}
                    />
                    
                    {selectedFile ? (
                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                                {getStatusIcon()}
                                <span className="text-sm font-medium truncate max-w-48">
                                    {selectedFile.name}
                                </span>
                                {!isUploading && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetForm();
                                        }}
                                    >
                                        <X className="size-3" />
                                    </Button>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Upload className="size-8 mx-auto text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">
                                    Drag and drop your invoice here
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    or click to browse files
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Supports: JPEG, PNG, GIF, PDF (max 5MB)
                            </p>
                        </div>
                    )}
                </div>

                {/* Upload Progress */}
                {isUploading && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{Math.round(uploadProgress)}%</span>
                        </div>
                        <Progress value={uploadProgress} className="w-full" />
                    </div>
                )}

                {/* Status Message */}
                {statusMessage && (
                    <Alert className={cn(
                        uploadStatus === 'error' && "border-destructive/50 text-destructive dark:border-destructive",
                        uploadStatus === 'success' && "border-green-600/50 text-green-700 dark:border-green-600 dark:text-green-400"
                    )}>
                        {getStatusIcon()}
                        <AlertDescription>
                            {statusMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Upload Button */}
                <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading || uploadStatus === 'success'}
                    className="w-full"
                >
                    {isUploading ? (
                        <>
                            <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : uploadStatus === 'success' ? (
                        <>
                            <CheckCircle className="size-4" />
                            Uploaded Successfully
                        </>
                    ) : (
                        <>
                            <Upload className="size-4" />
                            Upload Invoice
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}