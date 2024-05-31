// src/routes/api/chat/errorHandler.js

/**
 * Handles errors during the API request.
 * @param {Error} error - The error object.
 * @returns {Object} - The error response object.
 */
export function handleError(error) {
    console.error('Error in API request:', error);
    let status = 500;
    let errorMessage = 'Error getting GPT response';

    if (error.response && error.response.status) {
        status = error.response.status;
        errorMessage = `Status: ${status}, Message: ${error.response.data.error.message}`;
    } else {
        errorMessage = `Error: ${error.message}`;
    }

    return { status, errorMessage };
}
