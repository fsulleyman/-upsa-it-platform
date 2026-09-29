import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { ResourceType } from '../types';

export const LEARNING_RESOURCES_BUCKET = 'learning-resources';
export const MAX_RESOURCE_FILE_SIZE_MB = 50;

export const ALLOWED_RESOURCE_MIME_TYPES = [
  // Documents & Presentations
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'text/plain',
  'text/csv',

  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',

  // Media
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav'
];

export interface ResourceUploadResult {
  publicUrl: string | null;
  path: string | null;
  error: string | null;
}

/**
 * Ensures the 'learning-resources' bucket exists in Supabase Storage.
 */
export async function ensureResourceBucketExists(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (!listError && buckets) {
      const exists = buckets.some((b) => b.name === LEARNING_RESOURCES_BUCKET);
      if (exists) return true;
    }

    const { error: createError } = await supabase.storage.createBucket(LEARNING_RESOURCES_BUCKET, {
      public: true,
      fileSizeLimit: `${MAX_RESOURCE_FILE_SIZE_MB * 1024 * 1024}`
    });

    if (createError && !createError.message.includes('already exists')) {
      console.warn('Learning resources bucket creation note:', createError.message);
    }
    return true;
  } catch (err) {
    console.warn('ensureResourceBucketExists error:', err);
    return false;
  }
}

/**
 * Validates resource file size and type.
 */
export function validateResourceFile(file: File, maxSizeMB: number = MAX_RESOURCE_FILE_SIZE_MB): string | null {
  const fileMB = file.size / (1024 * 1024);
  if (fileMB > maxSizeMB) {
    return `File size (${fileMB.toFixed(2)} MB) exceeds the maximum allowed limit of ${maxSizeMB} MB.`;
  }

  // Fallback extension check for unknown mime types
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
  const allowedExtensions = ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar', 'txt', 'csv', 'jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm', 'mp3', 'wav'];

  const typeAllowed = ALLOWED_RESOURCE_MIME_TYPES.includes(file.type.toLowerCase());
  const extAllowed = allowedExtensions.includes(fileExt);

  if (!typeAllowed && !extAllowed) {
    return `File type '.${fileExt}' (${file.type || 'unknown'}) is not supported. Supported formats include PDF, PPT, PPTX, DOC, DOCX, ZIP, MP4, MP3, and images.`;
  }

  return null;
}

/**
 * Uploads a learning resource file to Supabase Storage with deterministic paths.
 * Path structure: learning-resources/<level>/semester-<semester>/<course-code>/<resource-type>/<uuid>-<sanitized-filename>
 */
export async function uploadLearningResourceFile(
  file: File,
  courseCode: string,
  level: string = '100',
  semester: string = '1',
  resourceType: ResourceType = 'other'
): Promise<ResourceUploadResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { publicUrl: null, path: null, error: 'Supabase client is not configured.' };
  }

  const validationError = validateResourceFile(file);
  if (validationError) {
    return { publicUrl: null, path: null, error: validationError };
  }

  try {
    await ensureResourceBucketExists();

    const sanitizedCourse = courseCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '_');
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueToken = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const filePath = `${level}/semester-${semester}/${sanitizedCourse}/${resourceType}/${uniqueToken}_${sanitizedFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(LEARNING_RESOURCES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      let friendlyMsg = uploadError.message;
      if (uploadError.message.toLowerCase().includes('bucket not found') || uploadError.message.toLowerCase().includes('not_found')) {
        friendlyMsg = `Storage bucket '${LEARNING_RESOURCES_BUCKET}' not found. Run src/lib/learning_resources_storage_schema.sql in Supabase SQL Editor.`;
      }
      return { publicUrl: null, path: null, error: friendlyMsg };
    }

    const { data: publicUrlData } = supabase.storage
      .from(LEARNING_RESOURCES_BUCKET)
      .getPublicUrl(filePath);

    return {
      publicUrl: publicUrlData.publicUrl,
      path: filePath,
      error: null
    };
  } catch (err: any) {
    return {
      publicUrl: null,
      path: null,
      error: err.message || 'An unexpected error occurred during resource file upload.'
    };
  }
}

/**
 * Replaces an existing resource file cleanly (uploads new file first, then deletes old file).
 */
export async function replaceLearningResourceFile(
  oldPathOrUrl: string | undefined | null,
  newFile: File,
  courseCode: string,
  level: string = '100',
  semester: string = '1',
  resourceType: ResourceType = 'other'
): Promise<ResourceUploadResult> {
  const result = await uploadLearningResourceFile(newFile, courseCode, level, semester, resourceType);

  if (result.publicUrl && oldPathOrUrl) {
    // Attempt deletion of previous storage object asynchronously without failing upload
    deleteLearningResourceFile(oldPathOrUrl).catch((err) => {
      console.warn('Cleanup of previous resource file failed:', err);
    });
  }

  return result;
}

/**
 * Safely removes a file from Supabase Storage given its URL or storage path.
 */
export async function deleteLearningResourceFile(urlOrPath: string): Promise<boolean> {
  if (!urlOrPath || !isSupabaseConfigured || !supabase) return false;

  try {
    let filePath = urlOrPath;
    if (urlOrPath.includes(LEARNING_RESOURCES_BUCKET)) {
      const parts = urlOrPath.split(`${LEARNING_RESOURCES_BUCKET}/`);
      if (parts.length > 1) {
        filePath = parts[1].split('?')[0];
      }
    }

    const { error } = await supabase.storage
      .from(LEARNING_RESOURCES_BUCKET)
      .remove([filePath]);

    return !error;
  } catch {
    return false;
  }
}
