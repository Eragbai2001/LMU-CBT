-- CreateTable
CREATE TABLE "maintenance_settings" (
    "id" SERIAL NOT NULL,
    "is_maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
    "maintenance_message" TEXT NOT NULL DEFAULT 'Our site is currently under maintenance. We''ll be back soon!',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_settings_pkey" PRIMARY KEY ("id")
);
