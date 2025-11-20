export type UploadContext = "userProfile" | "hotel" | "room" | "room-gallery" | "thumbnail" | "gallery" | "other";

export interface UploadImageArgs {
  file: File;
  context: UploadContext;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
}
