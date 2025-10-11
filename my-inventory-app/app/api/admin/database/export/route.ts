import { NextResponse } from "next/server";
import { backupDatabase } from "@/scripts/backup-node";

export async function POST() {
  try {
    const filename = await backupDatabase();
    
    return NextResponse.json({
      ok: true,
      data: {
        filename,
        message: "Backup created successfully"
      }
    });
    
  } catch (error: any) {
    console.error("❌ Backup error:", error);
    return NextResponse.json(
      { error: `Backup failed: ${error.message}` },
      { status: 500 }
    );
  }
}