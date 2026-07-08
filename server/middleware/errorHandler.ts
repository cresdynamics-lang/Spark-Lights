import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // Prisma unique constraint (e.g. Product.slug)
  if (err?.code === "P2002") {
    const target = Array.isArray(err?.meta?.target) ? err.meta.target.join(", ") : "field";
    return res.status(409).json({
      success: false,
      error: {
        code: "UNIQUE_CONSTRAINT",
        message: `Already exists (${target}). Use a different name or edit the existing product.`,
        details: err.meta || [],
      },
    });
  }

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || "INTERNAL_SERVER_ERROR";
  const message = err.message || "An unexpected error occurred";

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
      details: err.details || [],
    },
  });
};
