import { z } from "zod";
export const ValidateSignUpSchema = z
  .object({
    password: z.string().min(10, "Mật khẩu phải có ít nhất là 10 ký tự").regex(/[a-z]/,'ít nhất một ký tự thường').regex(/[A-Z]/,"ít nhât một ký tự in hoa").regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,"ít nhất một ký tự đặc biệt"),
    confirmPassword: z.string().min(10, "Xác nhận mật khẩu không được trống"),
    firstName: z.string().min(1, "Họ không được để trống"),
    lastName: z.string().min(1, "Tên không được để trống"),
  })
  .refine((data) => data.confirmPassword === data.password, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

export type ValidateSignUpInput = z.infer<typeof ValidateSignUpSchema>;
