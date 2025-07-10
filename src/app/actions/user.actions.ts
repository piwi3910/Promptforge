"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

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