import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const backupDir = path.join(process.cwd(), "backups");
    
    if (!fs.existsSync(backupDir)) {
      return NextResponse.json({ ok: true, data: [] });
    }

    const files = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.zip'))
      .map(filename => {
        const filepath = path.join(backupDir, filename);
        const stats = fs.statSync(filepath);
        return {
          filename,
          size: stats.size,
          created: stats.birthtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    return NextResponse.json({
      ok: true,
      data: files
    });
    
  } catch (error: any) {
    console.error("❌ Error listing backups:", error);
    return NextResponse.json(
      { error: `Failed to list backups: ${error.message}` },
      { status: 500 }
    );
  }
}