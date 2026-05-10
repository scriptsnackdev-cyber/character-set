'use server'

import { LoginFormSchema, FormState } from '@/lib/definitions'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function login(state: FormState, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    password: formData.get('password'),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { password } = validatedFields.data

  // 2. Check credentials
  // For internal use, we check against a single password hash in env
  const adminPasswordHash = process.env.APP_ADMIN_HASH

  if (!adminPasswordHash) {
    console.error(`DEBUG: APP_ADMIN_HASH is ${typeof adminPasswordHash}. Length: ${adminPasswordHash?.length}. Keys:`, Object.keys(process.env).filter(k => k.startsWith('APP_')))
    return {
      message: 'Server configuration error: APP_ADMIN_HASH not set.',
    }
  }

  const isPasswordValid = await bcrypt.compare(password, adminPasswordHash)

  if (!isPasswordValid) {
    return {
      message: 'Invalid password.',
    }
  }

  // 3. Create user session
  await createSession('admin')

  // 4. Redirect user
  redirect('/')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
