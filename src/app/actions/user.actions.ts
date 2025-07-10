"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

interface CreateUserParams {
    name: string;
    email: string;
    image?: string;
}

export async function createUser(user: CreateUserParams) {
    try {
        const newUser = await db.user.create({
            data: user,
        });
        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

interface UpdateUserParams {
    name?: string;
    image?: string;
}

export async function updateUser(userId: string, user: UpdateUserParams) {
    try {
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: user,
        });
        revalidatePath(`/`);
        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

export async function deleteUser(userId: string) {
    try {
        const deletedUser = await db.user.delete({
            where: { id: userId },
        });
        revalidatePath(`/`);
        return deletedUser;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

export async function getUserByEmail(email: string) {
    try {
        const user = await db.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        console.error("Error getting user by email:", error);
        return null;
    }
}

interface ChangePasswordParams {
    currentPassword: string;
    newPassword: string;
}

export async function changePassword({ currentPassword, newPassword }: ChangePasswordParams) {
    try {
        const user = await requireAuth();
        
        // Get the user's current password hash
        const userWithPassword = await db.user.findUnique({
            where: { id: user.id },
            select: { id: true, password: true }
        });

        if (!userWithPassword || !userWithPassword.password) {
            throw new Error("User not found or no password set");
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.password);
        if (!isCurrentPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        await db.user.update({
            where: { id: user.id },
            data: { password: hashedNewPassword }
        });

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
}