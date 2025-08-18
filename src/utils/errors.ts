import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "E_VALIDATION"
  | "E_CONFLICT"
  | "E_AUTH"
  | "E_NOT_FOUND"
  | "E_INTERNAL"
  | "E_FORBIDDEN";

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;
  details?: unknown;
  constructor(code: ApiErrorCode, message: string, status = 400, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message, details: error.details } },
      { status: error.status }
    );
  }
  const e = error as any;
  const msg = e?.message || "Erro inesperado";
  return NextResponse.json(
    { error: { code: "E_INTERNAL", message: msg } },
    { status: 500 }
  );
}

export function assert(cond: any, message: string, details?: unknown) {
  if (!cond) throw new ApiError("E_VALIDATION", message, 422, details);
}
