import z from "zod"

const signupSchema = z.object({
    firstname: z.string().min(3),
    lastname: z.string().min(3),
    email: z.string().email(),
    mobileno: z.string().length(10),
    password: z.string().min(6),
});

export default signupSchema