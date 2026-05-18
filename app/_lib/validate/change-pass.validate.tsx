import { z } from "zod";
export const ValidateChangePasswordSchema = z
  .object({
    password: z.string().min(10, "Mật khẩu phải có ít nhất là 10 ký tự").regex(/[a-z]/,'ít nhất một ký tự thường').regex(/[A-Z]/,"ít nhât một ký tự in hoa").regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/),
    confirmPassword: z.string().min(10, "Xác nhận mật khẩu không được trống"),
  })
  .refine((data) => data.confirmPassword === data.password, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

export type ValidateChangePasswordInput = z.infer<typeof ValidateChangePasswordSchema>;
