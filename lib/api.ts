export const getApiUrl = (endpoint: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    // Remove trailing slash from base if present
    const cleanBase = baseUrl.replace(/\/$/, '');
    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.replace(/^\//, '');

    // If base already ends with /api, don't add it again
    if (cleanBase.endsWith('/api')) {
        return `${cleanBase}/${cleanEndpoint}`;
    }

    // Otherwise, add /api
    return `${cleanBase}/api/${cleanEndpoint}`;
};
