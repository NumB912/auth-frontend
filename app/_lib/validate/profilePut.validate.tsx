import { z } from "zod";

export const ValidateProfileSchema = z.object({
    firstName: z
        .string()
        .min(1, "Họ không được để trống")
        .max(50, "Họ không được quá 50 ký tự")
        .trim(),

    lastName: z
        .string()
        .min(1, "Tên không được để trống")
        .max(50, "Tên không được quá 50 ký tự")
        .trim(),

    dateOfBirth: z.coerce
        .date("Ngày sinh không hợp lệ")
        .max(new Date(), "Ngày sinh không được lớn hơn hôm nay")
        .min(new Date("1900-01-01"), "Ngày sinh không hợp lệ").optional().nullable(),
    sex:z.enum(["male","female","other"],"Giới tính không hợp lệ")
})

export type ValidateProfileInput = z.infer<typeof ValidateProfileSchema>;