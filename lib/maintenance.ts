"use server";
import { db } from "./db";

// Interface for maintenance settings
export interface MaintenanceSettings {
  id: number;
  is_maintenance_mode: boolean;
  maintenance_message: string;
  updated_at: string;
}

// Function to get the current maintenance status
export async function getMaintenanceStatus(): Promise<{
  isMaintenanceMode: boolean;
  message: string;
}> {
  try {
    // Use the db singleton instead of creating a new PrismaClient instance
    const data = await db.maintenanceSettings.findFirst();

    if (!data) {
      // If no settings exist, create default settings
      const defaultSettings = await db.maintenanceSettings.create({
        data: {
          is_maintenance_mode: false,
          maintenance_message:
            "Our site is currently under maintenance. We'll be back soon!",
        },
      });

      return {
        isMaintenanceMode: defaultSettings.is_maintenance_mode,
        message: defaultSettings.maintenance_message,
      };
    }

    return {
      isMaintenanceMode: data.is_maintenance_mode,
      message: data.maintenance_message,
    };
  } catch (error) {
    console.error("Error in getMaintenanceStatus:", error);
    return { isMaintenanceMode: false, message: "" };
  }
}

// Function to update the maintenance status (Admin only)
export async function updateMaintenanceStatus(
  isMaintenanceMode: boolean,
  message?: string
): Promise<boolean> {
  try {
    const updateData: any = { is_maintenance_mode: isMaintenanceMode };

    if (message) {
      updateData.maintenance_message = message;
    }

    // Get the first record or create one if it doesn't exist
    const existingSettings = await db.maintenanceSettings.findFirst();

    if (existingSettings) {
      // Update existing record
      await db.maintenanceSettings.update({
        where: { id: existingSettings.id },
        data: updateData,
      });
    } else {
      // Create new record if none exists
      await db.maintenanceSettings.create({
        data: {
          is_maintenance_mode: isMaintenanceMode,
          maintenance_message:
            message ||
            "Our site is currently under maintenance. We'll be back soon!",
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error in updateMaintenanceStatus:", error);
    return false;
  }
}
