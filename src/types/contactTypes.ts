// ---------------- TYPES ----------------
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  message: string; // e.g., "Message sent successfully"
}

export interface ContactError {
  status: number;
  data?: {
    error?: string;
    message?: string;
    [key: string]: unknown;
  };
}
