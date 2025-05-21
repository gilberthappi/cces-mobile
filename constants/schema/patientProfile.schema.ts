import * as z from "zod";

// Zod schema for the patient profile
export const patientSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  phone_number: z.string().min(5),
  address: z.string().optional(),
  gender: z.string().optional(),
  date_of_birth: z.string().optional(),
  marital_status: z.string().optional(),
  alergies: z.string().optional(),
  chronic_diseases: z.string().optional(),
  current_prescription: z.string().optional(),
  habits: z.string().optional(),
  blood_group: z.string().optional(),
  is_pregnant: z.boolean(),
  has_family_members: z.boolean(),
  weight: z.number().optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;
