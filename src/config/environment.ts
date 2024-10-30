interface Environment {
  apiUrl: string;
  uploadUrl: string;
}

export const environment: Environment = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  uploadUrl: import.meta.env.VITE_UPLOAD_URL || 'http://localhost:3000/works/upload',
};
