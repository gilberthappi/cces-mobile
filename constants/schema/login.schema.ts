import z from "zod";

export const loginSchema = z.object({
	email: z.string().min(1, {
		message: "Email or username is required.",
	}),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters.",
	}),
});

export const registerSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	password: z.string({
		message: "Wrong Password. Please enter a valid password.",
	}),
	confirmPassword: z.string({
		message: "Wrong Password. Please enter a valid password.",
	}),
	firstName: z.string({message: "First Name is required"}),
	lastName: z.string({message: "First Name is required"}),
	photo: z
		.any()
		.optional()
		.refine(
			(files) => {
				if (!files) return true;
				if (files.length === 0) return true;
				return files[0] instanceof File && files[0].size <= 15 * 1024 * 1024;
			},
			"File must be a valid image and size must be less than 15MB"
		),
});

export const resetPasswordSchema = z.object({
	otp: z.string().min(1, "OTP is required"),
	email: z.string().email("Invalid email address"),
	newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
