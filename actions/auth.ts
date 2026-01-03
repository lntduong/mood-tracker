'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
})

export async function registerUser(formData: z.infer<typeof registerSchema>) {
    const validatedFields = registerSchema.safeParse(formData)

    if (!validatedFields.success) {
        return { error: 'Invalid fields' }
    }

    const { email, password, name } = validatedFields.data

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return { error: 'Email already exists' }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })
    } catch (error: any) {
        console.error('Registration Error Details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        })
        return { error: `Registration failed: ${error.message}` }
    }

    redirect('/login')
}
