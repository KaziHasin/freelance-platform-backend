import { ZodError, ZodTypeAny } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
export const validate =
    (schema: ZodTypeAny) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                schema.parse({ body: req.body, query: req.query, params: req.params });
                return next();
            } catch (error) {
                if (error instanceof ZodError) {
                    const errorMessages = error.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    }));
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .json({ error: 'ValidationError', details: errorMessages });
                }
                return res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Internal Server Error' });

            }
        };