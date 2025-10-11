import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    
    // Защита от path traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const filepath = path.join(process.cwd(), "backups", filename);
    
    if (!fs.existsSync(filepath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    fs.unlinkSync(filepath);
    
    return NextResponse.json({
      ok: true,
      message: "Backup deleted successfully"
    });
    
  } catch (error: any) {
    console.error("❌ Error deleting backup:", error);
    return NextResponse.json(
      { error: `Failed to delete backup: ${error.message}` },
      { status: 500 }
    );
  }
}