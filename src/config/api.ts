/**
 * API Configuration
 * 
 * Centralizing the API base URL to ensure easy transition between 
 * development (localhost) and production (live backend URL).
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
        SIGNUP: `${API_BASE_URL}/api/v1/auth/signup`,
    },
    DETECTION: {
        SINGLE: `${API_BASE_URL}/api/v1/detect`,
        FILE: `${API_BASE_URL}/api/v1/detect/file`,
        BULK: `${API_BASE_URL}/api/v1/bulk/file`,
    },
    THREATS: {
        OVERVIEW: `${API_BASE_URL}/api/v1/threats`,
        HEALTH: `${API_BASE_URL}/api/v1/health`,
    },
    ADMIN: {
        INVITES: `${API_BASE_URL}/api/v1/admin/invites`,
    },
    COLLABORATION: {
        CASES: `${API_BASE_URL}/api/v1/collaboration/cases`,
        COMMENTS: `${API_BASE_URL}/api/v1/collaboration/comments`,
    },
    REPORTS: {
        GENERATE: `${API_BASE_URL}/api/v1/reports/generate`,
    },
    AUTOMATION: {
        WORKFLOWS: `${API_BASE_URL}/api/v1/automation/workflows`,
    }
};
