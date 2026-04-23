// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileElement, StorageInfo } from './file-manager.model';

@Injectable({
  providedIn: 'root',
})
export class FileManagerService {
  private _files = new BehaviorSubject<FileElement[]>([]);
  public files$ = this._files.asObservable();

  // Mock initial data
  public mockData: FileElement[] = [
    {
      id: '1',
      name: 'Project Documents',
      type: 'folder',
      date: new Date('2024-01-15T10:00:00'),
      starred: true,
      parentId: null,
      color: '#6366f1',
    },
    {
      id: '2',
      name: 'Pictures',
      type: 'folder',
      date: new Date('2023-10-05'),
      starred: false,
      parentId: null,
      color: '#06b6d4',
    },
    {
      id: '3',
      name: 'Work',
      type: 'folder',
      date: new Date('2023-09-20'),
      starred: false,
      parentId: '1',
      color: '#f59e0b',
    },
    {
      id: '4',
      name: 'Project_Specification.pdf',
      type: 'file',
      size: 1024 * 1024 * 2.5,
      date: new Date('2023-10-10'),
      starred: true,
      parentId: '3',
      extension: 'pdf',
    },
    {
      id: '5',
      name: 'Logo_Final.png',
      type: 'file',
      size: 1024 * 512,
      date: new Date('2023-10-12'),
      starred: false,
      parentId: '2',
      extension: 'png',
    },
    {
      id: '6',
      name: 'Annual_Report.xlsx',
      type: 'file',
      size: 1024 * 256,
      date: new Date('2023-11-01'),
      starred: false,
      parentId: '1',
      extension: 'xlsx',
    },
    {
      id: '7',
      name: 'Meeting_Notes.docx',
      type: 'file',
      size: 1024 * 128,
      date: new Date('2023-11-05'),
      starred: true,
      parentId: '3',
      extension: 'docx',
    },
    {
      id: '8',
      name: 'Holiday_Photos',
      type: 'folder',
      date: new Date('2023-08-15'),
      starred: false,
      parentId: '2',
      color: '#ec4899',
    },
    {
      id: '9',
      name: 'Personal',
      type: 'folder',
      date: new Date('2024-01-02'),
      starred: false,
      parentId: null,
      color: '#10b981',
    },
    {
      id: '10',
      name: 'Videos',
      type: 'folder',
      date: new Date('2023-12-10'),
      starred: true,
      parentId: null,
      color: '#f43f5e',
    },
    {
      id: '11',
      name: 'Old Backups',
      type: 'folder',
      date: new Date('2022-05-20'),
      starred: false,
      parentId: '9',
      color: '#64748b',
    },
    {
      id: '12',
      name: 'System_Report_2023.pdf',
      type: 'file',
      size: 1024 * 1024 * 1.2,
      date: new Date('2023-12-05'),
      starred: false,
      parentId: '1',
      extension: 'pdf',
    },
    {
      id: '13',
      name: 'Financial_Budget.xlsx',
      type: 'file',
      size: 1024 * 512,
      date: new Date('2024-01-08'),
      starred: true,
      parentId: '1',
      extension: 'xlsx',
    },
    {
      id: '14',
      name: 'Profile_Picture.jpg',
      type: 'file',
      size: 1024 * 256,
      date: new Date('2023-10-15'),
      starred: false,
      parentId: '2',
      extension: 'jpg',
    },
    {
      id: '15',
      name: 'Background.png',
      type: 'file',
      size: 1024 * 1024 * 3.5,
      date: new Date('2023-11-20'),
      starred: false,
      parentId: '2',
      extension: 'png',
    },
    {
      id: '16',
      name: 'Resume_Updated.docx',
      type: 'file',
      size: 1024 * 64,
      date: new Date('2024-01-12'),
      starred: true,
      parentId: '9',
      extension: 'docx',
    },
    {
      id: '17',
      name: 'Identity_Card.pdf',
      type: 'file',
      size: 1024 * 128,
      date: new Date('2023-09-10'),
      starred: false,
      parentId: '9',
      extension: 'pdf',
    },
    {
      id: '18',
      name: 'Tutorial_Video.mp4',
      type: 'file',
      size: 1024 * 1024 * 45,
      date: new Date('2023-12-15'),
      starred: false,
      parentId: '10',
      extension: 'mp4',
    },
    {
      id: '19',
      name: 'Conference_Recording.mp4',
      type: 'file',
      size: 1024 * 1024 * 120,
      date: new Date('2024-01-05'),
      starred: false,
      parentId: '10',
      extension: 'mp4',
    },
    {
      id: '20',
      name: 'Project_Archive.zip',
      type: 'file',
      size: 1024 * 1024 * 25,
      date: new Date('2023-11-30'),
      starred: false,
      parentId: '11',
      extension: 'zip',
    },
    {
      id: '21',
      name: 'Meeting_Audio.mp3',
      type: 'file',
      size: 1024 * 1024 * 8,
      date: new Date('2023-10-02'),
      starred: false,
      parentId: '3',
      extension: 'mp3',
    },
    {
      id: '22',
      name: 'Notes.txt',
      type: 'file',
      size: 1024 * 2,
      date: new Date('2024-01-14'),
      starred: false,
      parentId: null,
      extension: 'txt',
    },
  ];

  private _storageInfo = new BehaviorSubject<StorageInfo>({
    total: 100 * 1024 * 1024 * 1024, // 100 GB
    used: 42.5 * 1024 * 1024 * 1024, // 42.5 GB
    categories: [
      { name: 'Documents', used: 12 * 1024 * 1024 * 1024, color: '#4f46e5', icon: 'description' },
      { name: 'Images', used: 18 * 1024 * 1024 * 1024, color: '#06b6d4', icon: 'image' },
      { name: 'Videos', used: 8 * 1024 * 1024 * 1024, color: '#f59e0b', icon: 'videocam' },
      { name: 'Others', used: 4.5 * 1024 * 1024 * 1024, color: '#94a3b8', icon: 'folder_zip' },
    ],
  });
  public storageInfo$ = this._storageInfo.asObservable();

  private trashData: FileElement[] = [];

  constructor() {
    this._files.next(this.mockData);
  }

  getFilesByParent(parentId: string | null): FileElement[] {
    return this.mockData.filter((f) => f.parentId === parentId);
  }

  getStarredFiles(): FileElement[] {
    return this.mockData.filter((f) => f.starred);
  }

  getRecentFiles(): FileElement[] {
    return [...this.mockData].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
  }

  getTrashFiles(): FileElement[] {
    return this.trashData;
  }

  toggleStar(fileId: string): void {
    const file = this.mockData.find((f) => f.id === fileId);
    if (file) {
      file.starred = !file.starred;
      this._files.next([...this.mockData]);
    }
  }

  deleteFile(fileId: string): void {
    const file = this.mockData.find((f) => f.id === fileId);
    if (file) {
      this.trashData.push({ ...file });
      this.mockData = this.mockData.filter((f) => f.id !== fileId);
      this._files.next([...this.mockData]);
    }
  }
}

