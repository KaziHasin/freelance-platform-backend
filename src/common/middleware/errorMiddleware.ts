import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
    console.error(err);

    // Handle known errors
    if (err.name === 'ValidationError') {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'ValidationError',
            details: [
                {
                    message: err.errors || err.message,
                }
            ]
        });
    }

    // Handle duplicate key error from Mongo
    if (err.code === 11000) {
        return res.status(StatusCodes.CONFLICT).json({
            error: 'DuplicateKeyError',
            details: [

                {
                    field: `body.${err?.field}`,
                    message: err.keyValue
                }
            ]
        });
    }

    // Handle custom errors (like Email already exists)
    if (err.message && err.message.includes('exists')) {
        return res.status(StatusCodes.CONFLICT).json({
            error: 'Conflict',
            details: [

                {
                    field: `body.${err.field}`,
                    message: err.message
                }
            ]
        });
    }

    // Default: Internal Server Error
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'InternalServerError',
        details: [
            {
                message: err.message || 'Something went wrong',
            }
        ]

    });
}
