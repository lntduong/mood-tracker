import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Vercel Cron will hit this endpoint
export async function GET(request: Request) {
    // Verify secret if needed (optional for Vercel Cron as it secures via header, 
    // but good practice to check for CRON_SECRET if manual protection is desired)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    try {
        // 1. Calculate "Today" in UTC/Database Standard
        // Cron runs at 12:00 UTC (7PM VN). "Today" in UTC is the correct date.
        const todayStr = new Date().toISOString().split('T')[0]
        const todayDate = new Date(`${todayStr}T12:00:00Z`)

        console.log(`[Cron] Checking for missing moods for date: ${todayDate.toISOString()}`)

        // 2. Find users who DO NOT have a mood entry for today
        // We get all users, then filter (or use whereNotIn if performance allows)
        // For scalability, a "where not exists" query is better, but Prisma simplifies:
        const usersWithoutMood = await prisma.user.findMany({
            where: {
                moods: {
                    none: {
                        date: todayDate
                    }
                },
                email: {
                    not: undefined // Ensure email exists
                }
            },
            select: {
                email: true,
                name: true
            }
        })

        if (usersWithoutMood.length === 0) {
            return NextResponse.json({ message: 'Everyone has logged their mood today!' })
        }

        console.log(`[Cron] Found ${usersWithoutMood.length} users to remind.`)

        // 3. Setup Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Or use 'host', 'port' for custom SMTP
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        // 4. Determine App URL (Local vs Production)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL
            ? process.env.NEXT_PUBLIC_APP_URL
            : process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : 'http://localhost:3000'

        // 5. Send Emails
        const emailPromises = usersWithoutMood.map(async (user) => {
            if (!user.email) return

            const mailOptions = {
                from: `"Mood Tracker" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: 'How was your day? 📝',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Hi ${user.name || 'Friend'},</h2>
                        <p>It's 7 PM! Don't forget to log your mood for today.</p>
                        <p>Taking a moment to reflect can help you understand your patterns better.</p>
                        <br/>
                        <a href="${appUrl}" 
                           style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                           Log Mood Now
                        </a>
                        <br/><br/>
                        <p style="color: #666; font-size: 12px;">Mood Tracker App</p>
                    </div>
                `,
            }

            try {
                await transporter.sendMail(mailOptions)
                console.log(`[Cron] Email sent to ${user.email}`)
            } catch (error) {
                console.error(`[Cron] Failed to send email to ${user.email}:`, error)
            }
        })

        await Promise.all(emailPromises)

        return NextResponse.json({
            success: true,
            remindersSent: usersWithoutMood.length
        })

    } catch (error) {
        console.error('[Cron] Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
