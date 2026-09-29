import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const BUCKET_NAME = 'site-media';
export const MAX_FILE_SIZE_MB = 5;
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export type StorageFolder =
  | 'hero'
  | 'promo-slides'
  | 'faculty'
  | 'projects'
  | 'programmes'
  | 'institution'
  | 'developers'
  | 'general';

export interface UploadResult {
  publicUrl: string | null;
  path: string | null;
  error: string | null;
}

/**
 * Ensures the 'site-media' bucket exists in Supabase Storage with public access.
 */
export async function ensureMediaBucketExists(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (!listError && buckets) {
      const exists = buckets.some((b) => b.name === BUCKET_NAME);
      if (exists) return true;
    }

    // Attempt bucket creation if list or bucket doesn't exist
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: `${MAX_FILE_SIZE_MB * 1024 * 1024}`,
      allowedMimeTypes: ALLOWED_MIME_TYPES
    });

    if (createError && !createError.message.includes('already exists')) {
      console.warn('Bucket creation note:', createError.message);
    }
    return true;
  } catch (err) {
    console.warn('ensureMediaBucketExists error:', err);
    return false;
  }
}

/**
 * Validates file type and size.
 */
export function validateImageFile(file: File, maxSizeMB: number = MAX_FILE_SIZE_MB): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return `Invalid file format (${file.type || 'unknown'}). Supported formats: JPG, PNG, WEBP, GIF.`;
  }

  const fileMB = file.size / (1024 * 1024);
  if (fileMB > maxSizeMB) {
    return `File size (${fileMB.toFixed(2)} MB) exceeds maximum allowed limit of ${maxSizeMB} MB.`;
  }

  return null;
}

/**
 * Uploads an image file to Supabase Storage inside the designated folder.
 */
export async function uploadSiteImage(
  file: File,
  folder: StorageFolder = 'general',
  maxSizeMB: number = MAX_FILE_SIZE_MB
): Promise<UploadResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { publicUrl: null, path: null, error: 'Supabase client is not configured.' };
  }

  const validationError = validateImageFile(file, maxSizeMB);
  if (validationError) {
    return { publicUrl: null, path: null, error: validationError };
  }

  try {
    await ensureMediaBucketExists();

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const filePath = `${folder}/${timestamp}_${sanitizedFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      let friendlyMsg = uploadError.message;
      if (uploadError.message.toLowerCase().includes('bucket not found') || uploadError.message.toLowerCase().includes('not_found')) {
        friendlyMsg = `Storage bucket '${BUCKET_NAME}' not found in Supabase. Please run src/lib/storage_schema_and_rls.sql in Supabase SQL Editor or create bucket '${BUCKET_NAME}' in Storage.`;
      }
      return { publicUrl: null, path: null, error: friendlyMsg };
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return {
      publicUrl: publicUrlData.publicUrl,
      path: filePath,
      error: null
    };
  } catch (err: any) {
    return {
      publicUrl: null,
      path: null,
      error: err.message || 'An unexpected error occurred during image upload.'
    };
  }
}

/**
 * Safely removes a file from Supabase Storage given its URL or storage path.
 */
export async function deleteSiteImage(urlOrPath: string): Promise<boolean> {
  if (!urlOrPath || !isSupabaseConfigured || !supabase) return false;

  try {
    let filePath = urlOrPath;
    if (urlOrPath.includes(BUCKET_NAME)) {
      const parts = urlOrPath.split(`${BUCKET_NAME}/`);
      if (parts.length > 1) {
        filePath = parts[1].split('?')[0];
      }
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    return !error;
  } catch {
    return false;
  }
}
