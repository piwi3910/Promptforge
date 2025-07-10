import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getUserByEmail } from "@/app/actions/user.actions"

export async function getCurrentUser() {
  try {
    console.log("Getting current user session...")
    const session = await getServerSession(authOptions)
    
    console.log("Session data:", session)
    
    if (!session?.user?.email) {
      console.log("No session or email found")
      return null
    }

    console.log("Fetching user by email:", session.user.email)
    const user = await getUserByEmail(session.user.email)
    console.log("User found:", user)
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function requireAuth() {
  console.log("Requiring authentication...")
  const user = await getCurrentUser()
  
  if (!user) {
    console.error("User not authenticated - throwing error")
    throw new Error("User not authenticated")
  }
  
  console.log("User authenticated successfully:", user.id)
  return user
}