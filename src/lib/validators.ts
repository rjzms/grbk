import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email("请输入有效的邮箱地址")
    .max(255, "邮箱长度不能超过 255 个字符"),
  username: z
    .string()
    .trim()
    .min(2, "用户名至少需要 2 个字符")
    .max(30, "用户名不能超过 30 个字符")
    .regex(
      /^[a-zA-Z0-9一-龥_-]+$/,
      "用户名只能包含字母、数字、中文、下划线和连字符",
    ),
  password: z
    .string()
    .min(8, "密码至少需要 8 个字符")
    .max(128, "密码不能超过 128 个字符"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("请输入有效的邮箱地址"),
  password: z.string().min(1, "请输入密码"),
});

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "标题不能为空")
    .max(200, "标题不能超过 200 个字符"),
  content: z.string().default(""),
  excerpt: z.string().trim().max(500, "摘要不能超过 500 个字符").optional(),
  coverImage: z.string().url("封面图必须是有效的 URL").optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  tags: z
    .array(z.string().trim().max(30))
    .max(10, "最多 10 个标签")
    .default([]),
});

export const updatePostSchema = createPostSchema.partial();

export const searchSchema = z.object({
  q: z.string().trim().min(1).max(200),
  page: z.coerce.number().int().positive().default(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
