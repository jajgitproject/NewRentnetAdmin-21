// @ts-nocheck
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

export function isExportJobRunning(status: any): boolean {
  const current = String(status?.status ?? status?.Status ?? '').toLowerCase();
  return current === 'pending' || current === 'running';
}

export function isExportJobReady(status: any): boolean {
  const current = String(status?.status ?? status?.Status ?? '').toLowerCase();
  return current === 'completed' && (status?.fileReady ?? status?.FileReady ?? false);
}

export function pollExportJob(httpClient: HttpClient, statusUrl: string): Observable<any> {
  return timer(0, 3000).pipe(
    switchMap(() => httpClient.get(statusUrl)),
    takeWhile((status: any) => isExportJobRunning(status), true)
  );
}

export async function extractExportErrorMessage(error: any, fallback = 'Export failed.'): Promise<string> {
  if (!error) {
    return fallback;
  }

  const blob = error?.error;
  if (blob instanceof Blob) {
    const text = await blob.text();
    try {
      const parsed = JSON.parse(text || '{}');
      return parsed.message || parsed.Message || text || fallback;
    } catch {
      return text?.trim() || fallback;
    }
  }

  return error?.error?.message || error?.error?.Message || error?.message || fallback;
}
