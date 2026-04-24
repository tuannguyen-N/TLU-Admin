const domain = import.meta.env.VITE_API_DOMAIN || '';

export const API_BASE_URL = `${domain}/api/v1/admin`;

export { domain };