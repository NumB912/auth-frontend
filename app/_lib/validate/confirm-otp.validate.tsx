import {z} from "zod";
export const validateOTPSchema = z.object({
   otp:z.string().length(6,"Phải đúng 6 ký tự là số").regex(/^[0-9]{6}$/,"Phải là ký tự số")
})

export type ValidateOTPInput = z.infer<typeof validateOTPSchema>