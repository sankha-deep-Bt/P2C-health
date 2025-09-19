import { z, ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

/* ---------- Register Validator ---------- */
export const registerSchema = z
  .object({
    body: z.object({
      userType: z.enum(["base", "doctor", "patient", "admin"]),
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.email("Invalid email"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string().min(6),
      // specialization: z.string().optional(), // only for doctors
      // phone: z.string().optional(),
      // address: z.string().optional(),
      // isApproved: z.boolean().optional(),
    }),
  })
  .refine((data) => data.body.password === data.body.confirmPassword, {
    message: "Passwords do not match",
    path: ["body", "confirmPassword"],
  });

/* ---------- Login Validator ---------- */
export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err: any) {
      console.error(err);
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors,
      });
    }
  };

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
