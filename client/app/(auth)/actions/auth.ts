import { FormState, SigninFormSchema } from "../lib/definitions";

export const signin = async (state: FormState, formData: FormData) => {
    // Validate form fields
    const validatedFields = SigninFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
};
