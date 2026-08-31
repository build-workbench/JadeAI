import { NextRequest, NextResponse } from 'next/server';
import { resumeRepository } from '@/lib/db/repositories/resume.repository';
import { resolveCurrentUser } from '@/lib/auth/helpers';
import { generatePdf } from '@/lib/pdf/generate-pdf';
import { generateHtml, generatePdfHtml } from './builders';
import { buildExportContentDisposition } from './content-disposition';
import { generatePlainText } from './plain-text';
import { generateDocxBuffer } from './docx';

export const dynamic = 'force-dynamic';

// Chromium download + PDF render needs more time on Vercel serverless
export const maxDuration = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await resolveCurrentUser({ request });
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resume = await resumeRepository.findById(id);
    if (!resume) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (resume.userId !== currentUser.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const format = request.nextUrl.searchParams.get('format') || 'json';
    const title = resume.title || 'resume';
    const now = new Date();
    const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    const filename = `${title}-${ts}`;

    switch (format) {
      case 'json': {
        return NextResponse.json(resume);
      }
      case 'html': {
        // forPrint=true returns the print-optimized layout (used by the client-side
        // "print to PDF" fallback when server Chromium is unavailable, issue #85).
        const forPrint = request.nextUrl.searchParams.get('forPrint') === 'true';
        const html = await generateHtml(resume, forPrint, request.nextUrl.origin);
        return new NextResponse(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Disposition': buildExportContentDisposition(filename, 'html'),
          },
        });
      }
      case 'txt': {
        const text = generatePlainText(resume);
        return new NextResponse(text, {
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': buildExportContentDisposition(filename, 'txt'),
          },
        });
      }
      case 'docx': {
        const docxBuffer = await generateDocxBuffer(resume);
        return new NextResponse(new Uint8Array(docxBuffer), {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': buildExportContentDisposition(filename, 'docx'),
          },
        });
      }
      case 'pdf': {
        const fitOnePage = request.nextUrl.searchParams.get('fitOnePage') === 'true';
        const pdfHtml = await generatePdfHtml(resume, request.nextUrl.origin);
        const pdfBuffer = await generatePdf(pdfHtml, { fitOnePage });
        return new NextResponse(new Uint8Array(pdfBuffer), {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': buildExportContentDisposition(filename, 'pdf'),
          },
        });
      }
      default: {
        return NextResponse.json(
          { error: `Unsupported format: ${format}. Supported: json, html, txt, docx, pdf` },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error('GET /api/resume/[id]/export error:', error);
    // Surface the real reason (e.g. "No Chrome/Chromium found ...") so PDF export
    // failures are diagnosable instead of a generic 500 (issue #85).
    const detail = error instanceof Error && error.message ? error.message : '';
    return NextResponse.json(
      { error: detail || 'Internal server error' },
      { status: 500 }
    );
  }
}
