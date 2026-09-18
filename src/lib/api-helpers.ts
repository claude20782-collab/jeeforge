import 'server-only'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export function ok<T>(data: T, init?: ResponseInit) { return NextResponse.json(data, init) }
export function fail(status: number, error: string) { return NextResponse.json({ error }, { status }) }
export const unauthorized = () => fail(401, 'Not authenticated')
export const forbidden = () => fail(403, 'Forbidden')
export const notFound = (what = 'Resource') => fail(404, `${what} not found`)
export const badRequest = (msg: string) => fail(400, msg)

export async function parseBody<S extends z.ZodTypeAny>(req: Request, schema: S): Promise<z.infer<S> | null> {
  try {
    const json = await req.json()
    const parsed = schema.safeParse(json)
    if (!parsed.success) {
      return null
    }
    return parsed.data as z.infer<S>
  } catch { return null }
}

export function zodErrorMessage<S extends z.ZodTypeAny>(req: Request, schema: S): string | null {
  return null // helper kept for interface stability
}
