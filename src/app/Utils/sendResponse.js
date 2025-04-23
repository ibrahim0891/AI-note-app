/**
 * Sends a standardized JSON response.
 *
 * @param {import("express").Response} res - The Express response object.
 * @param {Object} data - The response data.
 * @param {boolean} data.success - Indicates if the operation was successful.
 * @param {number} data.statusCode - The HTTP status code.
 * @param {string} data.message - A descriptive message.
 * @param {any} data.data - The payload data (can be any type).
 */
export const sendResponse = (res, data) => {
    const { success, message, data: payload } = data;
    res.status(data.statusCode || 500 ).json({
        success,
        message,
        data: payload,
    });
    return;
};