import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { connectDB } from '@/lib/db/connection';
import { uploadToMinio, uploadChatFile } from '@/lib/minio';
import FileUpload from '@/lib/db/models/FileUpload';
import { logApiRequest, logApiResponse, logError, logFileOperation, logInfo } from '@/lib/logger';

// Document configuration for validation
const DOCUMENT_CONFIGS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
};

// Chat files have more permissive settings
const CHAT_FILE_CONFIGS = {
  maxSize: 50 * 1024 * 1024, // 50MB for chat files
  allowedTypes: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'application/pdf', 'text/plain', 'text/csv',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip', 'application/x-rar-compressed',
    'video/mp4', 'video/avi', 'video/mov',
    'audio/mpeg', 'audio/wav', 'audio/ogg'
  ]
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const url = request.url;
  const method = request.method;

  try {
    logApiRequest(method, url);

    // Step 1: Validate session
    let session;
    try {
      session = await getServerSession(authOptions);
      if (!session?.user) {
        const duration = Date.now() - startTime;
        logApiResponse(method, url, 401, duration);
        return NextResponse.json({ 
          error: 'Unauthorized',
          details: 'No valid session found'
        }, { status: 401 });
      }
      logInfo('Session validated', { userId: session.user.id });
    } catch (error) {
      logError('Session validation failed', error);
      return NextResponse.json({ 
        error: 'Authentication error',
        details: error instanceof Error ? error.message : 'Unknown auth error'
      }, { status: 401 });
    }

    // Step 2: Connect to database
    try {
      await connectDB();
      logInfo('Database connected');
    } catch (error) {
      const duration = Date.now() - startTime;
      logError('Database connection failed', error);
      logApiResponse(method, url, 500, duration);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown DB error'
      }, { status: 500 });
    }

    // Step 3: Validate Content-Type
    const contentType = request.headers.get('content-type') || '';
    logInfo('Request headers', { contentType, userId: session.user.id });

    if (!contentType.includes('multipart/form-data')) {
      const duration = Date.now() - startTime;
      logError('Invalid content type', null, { contentType });
      logApiResponse(method, url, 400, duration, session.user.id);
      return NextResponse.json({
        error: 'Invalid content type',
        details: `Expected multipart/form-data, got: ${contentType}`,
        expected: 'multipart/form-data'
      }, { status: 400 });
    }

    // Step 4: Parse FormData
    let formData: FormData;
    let file: File | null = null;
    let documentType: string | null = null;
    let applicationId: string | null = null;

    try {
      formData = await request.formData();
      file = formData.get('file') as File | null;
      documentType = formData.get('documentType') as string | null;
      applicationId = formData.get('applicationId') as string | null;

      logInfo('FormData parsed', {
        hasFile: !!file,
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type,
        documentType,
        applicationId,
        userId: session.user.id,
        formDataKeys: Array.from(formData.keys())
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logError('FormData parsing failed', error, { 
        contentType, 
        userId: session.user.id,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined
      });
      logApiResponse(method, url, 400, duration, session.user.id);
      return NextResponse.json({
        error: 'Failed to parse form data',
        details: error instanceof Error ? error.message : 'Invalid multipart/form-data format',
        hint: 'Ensure the request includes proper multipart/form-data boundary'
      }, { status: 400 });
    }

    // Step 5: Validate required fields
    if (!file || !(file instanceof File)) {
      const duration = Date.now() - startTime;
      logError('No valid file provided', null, { 
        userId: session.user.id,
        fileType: typeof file,
        fileValue: file
      });
      logApiResponse(method, url, 400, duration, session.user.id);
      return NextResponse.json({ 
        error: 'No file provided',
        details: 'The "file" field is missing or invalid in the form data'
      }, { status: 400 });
    }

    if (!documentType) {
      const duration = Date.now() - startTime;
      logError('Document type not provided', null, { userId: session.user.id });
      logApiResponse(method, url, 400, duration, session.user.id);
      return NextResponse.json({ 
        error: 'Document type is required',
        details: 'The "documentType" field must be provided'
      }, { status: 400 });
    }

    // Step 6: Choose configuration and validate
    const isChat = documentType === 'chat_files';
    const config = isChat ? CHAT_FILE_CONFIGS : DOCUMENT_CONFIGS;

    // Validate file size
    if (file.size === 0) {
      const duration = Date.now() - startTime;
      logError('Empty file provided', null, { fileName: file.name, userId: session.user.id });
      logApiResponse(method, url, 400, duration, session.user.id);
      return NextResponse.json({
        error: 'Empty file',
        details: 'The uploaded file is empty (0 bytes)'
      }, { status: 400 });
    }

    if (file.size > config.maxSize) {
      const duration = Date.now() - startTime;
      logError('File size exceeds limit', null, {
        fileSize: file.size,
        maxSize: config.maxSize,
        fileName: file.name,
        documentType,
        userId: session.user.id
      });
      logApiResponse(method, url, 400, duration, session.user.id);
      return NextResponse.json({
        error: `File size exceeds limit`,
        details: `File is ${(file.size / (1024 * 1024)).toFixed(2)}MB, maximum is ${config.maxSize / (1024 * 1024)}MB`,
        fileSize: file.size,
        maxSize: config.maxSize
      }, { status: 400 });
    }

    // Validate file type
    if (!config.allowedTypes.includes(file.type)) {
      const duration = Date.now() - startTime;
      logError('Invalid file type', null, {
        fileName: file.name,
        fileType: file.type,
        allowedTypes: config.allowedTypes,
        documentType,
        userId: session.user.id
      });
      logApiResponse(method, url, 400, duration, session.user.id);
      return NextResponse.json({
        error: `Invalid file type: ${file.type}`,
        details: `This file type is not allowed for ${documentType}`,
        allowedTypes: config.allowedTypes,
        receivedType: file.type
      }, { status: 400 });
    }

    // Step 7: Convert file to buffer
    let buffer: Buffer;
    try {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      logInfo('File converted to buffer', { 
        bufferSize: buffer.length,
        fileName: file.name,
        userId: session.user.id
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logError('Failed to convert file to buffer', error, { 
        fileName: file.name,
        userId: session.user.id
      });
      logApiResponse(method, url, 500, duration, session.user.id);
      return NextResponse.json({
        error: 'Failed to process file',
        details: 'Could not read file contents',
        technicalDetails: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

    // Step 8: Upload to MinIO
    let uploadResult;
    try {
      if (isChat) {
        logInfo('Uploading to MinIO (chat file)', { 
          fileName: file.name,
          chatId: applicationId,
          userId: session.user.id
        });
        uploadResult = await uploadChatFile({
          fileName: file.name,
          fileBuffer: buffer,
          contentType: file.type,
          chatId: applicationId || '',
          userId: session.user.id
        });
      } else {
        logInfo('Uploading to MinIO (document)', { 
          fileName: file.name,
          documentType,
          applicationId,
          userId: session.user.id
        });
        uploadResult = await uploadToMinio({
          fileName: file.name,
          fileBuffer: buffer,
          contentType: file.type,
          metadata: {
            documentType,
            applicationId: applicationId || '',
            uploadedBy: session.user.id,
            originalName: file.name
          }
        });
      }

      if (!uploadResult || !uploadResult.fileName || !uploadResult.fileUrl) {
        throw new Error('Invalid upload result from MinIO');
      }

      logFileOperation('upload', file.name, true, file.size, {
        documentType,
        applicationId,
        minioFileName: uploadResult.fileName,
        userId: session.user.id
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logError('MinIO upload failed', error, {
        fileName: file.name,
        fileSize: file.size,
        documentType,
        isChat,
        userId: session.user.id,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined
      });
      logApiResponse(method, url, 500, duration, session.user.id);
      return NextResponse.json({
        error: 'Failed to upload file to storage',
        details: error instanceof Error ? error.message : 'MinIO upload error',
        step: 'storage_upload'
      }, { status: 500 });
    }

    // Step 9: Save to database
    let fileRecord;
    try {
      fileRecord = new FileUpload({
        originalName: file.name,
        fileName: uploadResult.fileName,
        fileUrl: uploadResult.fileUrl,
        fileType: file.type,
        fileSize: file.size,
        mimeType: file.type,
        uploadedBy: session.user.id,
        documentType,
        applicationId: applicationId || undefined,
      });

      await fileRecord.save();
      logInfo('File record saved to database', {
        fileId: fileRecord._id,
        fileName: file.name,
        userId: session.user.id
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logError('Database save failed', error, {
        fileName: file.name,
        minioFileName: uploadResult.fileName,
        userId: session.user.id,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined
      });
      logApiResponse(method, url, 500, duration, session.user.id);
      return NextResponse.json({
        error: 'Failed to save file record',
        details: error instanceof Error ? error.message : 'Database save error',
        step: 'database_save',
        hint: 'File was uploaded but record creation failed'
      }, { status: 500 });
    }

    // Step 10: Success response
    const duration = Date.now() - startTime;
    logApiResponse(method, url, 200, duration, session.user.id, {
      fileName: file.name,
      fileSize: file.size,
      documentType,
      fileId: fileRecord._id
    });

    return NextResponse.json({
      success: true,
      file: {
        _id: fileRecord._id,
        originalName: fileRecord.originalName,
        fileName: fileRecord.fileName,
        fileUrl: fileRecord.fileUrl,
        fileType: fileRecord.fileType,
        fileSize: fileRecord.fileSize,
        uploadedBy: fileRecord.uploadedBy,
        uploadedAt: fileRecord.uploadedAt,
        documentType: fileRecord.documentType,
        applicationId: fileRecord.applicationId,
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logError('Unhandled file upload error', error, { 
      url, 
      method,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      errorName: error instanceof Error ? error.name : typeof error
    });
    logFileOperation('upload', 'unknown', false, 0, { 
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: error instanceof Error ? error.name : typeof error
    });
    logApiResponse(method, url, 500, duration);

    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
        type: error instanceof Error ? error.name : 'UnknownError'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    const documentType = searchParams.get('documentType');
    const userId = searchParams.get('userId');

    // Build query
    const query: Record<string, string> = {};
    
    if (applicationId) {
      query.applicationId = applicationId;
    }
    
    if (documentType) {
      query.documentType = documentType;
    }
    
    if (userId) {
      query.uploadedBy = userId;
    } else if (session.user.role === 'user') {
      // Users can only see their own files
      query.uploadedBy = session.user.id;
    }

    const files = await FileUpload.find(query)
      .sort({ uploadedAt: -1 })
      .populate('uploadedBy', 'firstName lastName email')
      .lean();

    return NextResponse.json({
      success: true,
      files
    });

  } catch (error) {
    console.error('Get files error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch files',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}