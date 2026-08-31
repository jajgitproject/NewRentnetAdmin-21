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

function exportJobStorageKey(pageKey: string): string {
  return `rentnet.misExportJob.${pageKey}`;
}

function readStorageItem(storage: Storage | undefined, key: string): string | null {
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageItem(storage: Storage | undefined, key: string, value: string | null) {
  if (!storage) {
    return;
  }

  try {
    if (!value) {
      storage.removeItem(key);
      return;
    }

    storage.setItem(key, value);
  } catch {
  }
}

export function persistExportJobId(pageKey: string, jobId: string | null) {
  if (!pageKey) {
    return;
  }

  const key = exportJobStorageKey(pageKey);
  writeStorageItem(typeof localStorage === 'undefined' ? undefined : localStorage, key, jobId);
  writeStorageItem(typeof sessionStorage === 'undefined' ? undefined : sessionStorage, key, jobId);
}

export function loadPersistedExportJobId(pageKey: string): string | null {
  if (!pageKey) {
    return null;
  }

  const key = exportJobStorageKey(pageKey);
  return readStorageItem(typeof localStorage === 'undefined' ? undefined : localStorage, key)
    || readStorageItem(typeof sessionStorage === 'undefined' ? undefined : sessionStorage, key);
}

export function isExportJobNotFoundError(error: any): boolean {
  const text =
    typeof error === 'string'
      ? error
      : error?.message || error?.error || error?.Message || '';
  return String(text).toLowerCase().includes('export job not found');
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
