import {z} from "zod";
export const validateEmailSchema = z.object({
    email:z.string().min(1,"Email không được rỗng").email("Lỗi không đúng cấu trúc email")
})

export type ValidateEmailInput = z.infer<typeof validateEmailSchema>