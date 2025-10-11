import { NextResponse } from "next/server";
import { restoreDatabase } from "@/scripts/restore-node";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("backup") as File;

    if (!file) {
      return NextResponse.json({ error: "No backup file provided" }, { status: 400 });
    }

    // Сохраняем загруженный файл
    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const filename = `upload-${Date.now()}.zip`;
    const filepath = path.join(backupDir, filename);

    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));

    // Восстанавливаем БД
    await restoreDatabase(filename);

    // Удаляем временный файл
    fs.unlinkSync(filepath);

    return NextResponse.json({
      ok: true,
      message: "Database restored successfully"
    });

  } catch (error: any) {
    console.error("❌ Restore error:", error);
    return NextResponse.json(
      { error: `Restore failed: ${error.message}` },
      { status: 500 }
    );
  }
}