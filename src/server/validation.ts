import { z } from "zod"

export default function withValidation<T>(
    schema: z.ZodSchema<T>,
    handler: (data: T, socket: any, ack?: Function) => void,
    formatError?: (err: z.ZodError) => any
) {
    return function (this: any, payload: unknown, ack?: Function) {
        const result = schema.safeParse(payload)

        if (!result.success) {
            const errorResponse = formatError
                ? formatError(result.error) // dùng formatter bên ngoài
                : {
                    success: false,
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "Payload không hợp lệ",
                        details: result.error.flatten((issue) => {
                            return `[${issue.path.join(".")}] ${issue.message}`
                        })
                    },
                }

            return ack?.(errorResponse)
        }

        handler(result.data, this, ack)
    }
}
