import {z} from "zod";
export const validateSignInSchema = z.object({
    email:z.string().min(1,"Email không được rỗng").email("Lỗi không đúng cấu trúc email"),
    password:z.string().min(1,"Mật khẩu không được trống")
})

export type ValidateSignInInput = z.infer<typeof validateSignInSchema>