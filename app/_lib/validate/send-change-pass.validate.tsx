import {z} from "zod";
export const validateChangePassSchema = z.object({
    email:z.string().min(1,"Email không được rỗng").email("Lỗi không đúng cấu trúc email")
})

export type ValidateChangePassInput = z.infer<typeof validateChangePassSchema>