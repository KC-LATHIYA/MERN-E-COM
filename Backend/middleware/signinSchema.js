import z from "zod";

const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export default signinSchema