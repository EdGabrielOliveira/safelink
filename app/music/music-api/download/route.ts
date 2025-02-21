import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

// Função para sanitizar o nome do arquivo
function sanitizeFileName(fileName: string) {
  return fileName.replace(/[\/:*?"<>|\\]/g, "_").replace(/[\x00-\x1F\x80-\x9F]/g, "");
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL do vídeo é obrigatória" }, { status: 400 });
  }

  try {
    const command = `yt-dlp -i --extract-audio --get-url --audio-quality 0 --audio-format mp3 --get-title "${url}"`;
    console.log(`Executando comando: ${command}`);
    const { stdout, stderr } = await execPromise(command, { env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
    if (stderr) {
      console.error(`Erro no comando yt-dlp: ${stderr}`);
    }

    const output = stdout.trim().split("\n");
    const title = output[0];
    const audioUrl = output[1];

    if (!audioUrl) {
      throw new Error("URL de download não encontrada");
    }

    const sanitizedTitle = sanitizeFileName(title);

    return NextResponse.json({ downloadUrl: `${audioUrl}?title=${sanitizedTitle}`, title: sanitizedTitle });
  } catch (error) {
    console.error(`Erro ao processar o download: ${(error as Error).message}`);
    console.error(`Detalhes do erro: ${(error as Error).stack}`);
    return NextResponse.json(
      { error: "Erro ao processar o download", details: (error as Error).message },
      { status: 500 },
    );
  }
}
