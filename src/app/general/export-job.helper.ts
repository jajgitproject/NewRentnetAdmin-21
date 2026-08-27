// @ts-nocheck
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

export function getExportJobStatusName(status: any): string {
  return String(status?.status ?? status?.Status ?? '').toLowerCase();
}

export function isExportJobPending(status: any): boolean {
  return getExportJobStatusName(status) === 'pending';
}

export function isExportJobActivelyDumping(status: any): boolean {
  return getExportJobStatusName(status) === 'running';
}

export function isExportJobRunning(status: any): boolean {
  const current = getExportJobStatusName(status);
  return current === 'pending' || current === 'running';
}

export function formatExportElapsedTime(startedAt: number | null, status: any): string {
  if (isExportJobPending(status) || !startedAt) {
    return '—';
  }

  const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

export function exportSearchButtonLabel(status: any, inProgress: boolean): string {
  if (isExportJobPending(status)) {
    return 'Queued...';
  }
  if (inProgress || isExportJobActivelyDumping(status)) {
    return 'Exporting...';
  }
  return 'Search';
}

export function markExportDumpStarted(startedAt: number | null, status: any): number | null {
  if (isExportJobActivelyDumping(status) && startedAt == null) {
    return Date.now();
  }
  return startedAt;
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

export function persistExportJobId(pageKey: string, jobId: string | null) {
  if (!pageKey || typeof sessionStorage === 'undefined') {
    return;
  }
  const key = `rentnet.misExportJob.${pageKey}`;
  if (!jobId) {
    sessionStorage.removeItem(key);
    return;
  }
  sessionStorage.setItem(key, jobId);
}

export function loadPersistedExportJobId(pageKey: string): string | null {
  if (!pageKey || typeof sessionStorage === 'undefined') {
    return null;
  }
  return sessionStorage.getItem(`rentnet.misExportJob.${pageKey}`);
}

export function isExportJobCancelled(status: any): boolean {
  const current = String(status?.status ?? status?.Status ?? '').toLowerCase();
  return current === 'cancelled';
}

export const IN_FLIGHT_EXPORT_MESSAGE =
  'You already have an export in the queue. Cancel it or wait for it to finish.';

export function exportJobAcceptedSnackbarMessage(startResult: any): string {
  const message = startResult?.message ?? startResult?.Message;
  if (typeof message === 'string' && message.trim()) {
    return message.trim();
  }

  const status = String(startResult?.status ?? startResult?.Status ?? '').toLowerCase();
  if (status === 'running') {
    return 'Export job started. CSV will be ready when processing completes.';
  }

  return 'Export queued.';
}

function messageFromObject(value: any): string {
  if (!value || typeof value !== 'object') {
    return '';
  }
  const raw = value.message ?? value.Message;
  return typeof raw === 'string' && raw.trim() ? raw.trim() : '';
}

function isAngularHttpFailureMessage(message: string): boolean {
  return message.toLowerCase().includes('http failure response');
}

export async function extractExportErrorMessage(error: any, fallback = 'Export failed.'): Promise<string> {
  if (!error) {
    return fallback;
  }

  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }

  const blob = error?.error;
  if (blob instanceof Blob) {
    const text = await blob.text();
    try {
      const parsed = JSON.parse(text || '{}');
      return parsed.message || parsed.Message || text?.trim() || fallback;
    } catch {
      return text?.trim() || fallback;
    }
  }

  if (typeof error?.error === 'string' && error.error.trim()) {
    return error.error.trim();
  }

  const fromBody = messageFromObject(error?.error);
  if (fromBody) {
    return fromBody;
  }

  if (typeof error?.message === 'string' && error.message.trim() && !isAngularHttpFailureMessage(error.message)) {
    return error.message.trim();
  }

  return fallback;
}
