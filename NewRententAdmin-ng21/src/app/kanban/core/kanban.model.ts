// @ts-nocheck
import { Injectable } from '@angular/core';
import { Adapter } from './adapters';

export enum KanbanStatus {
  NEWTASK = 0,
  RUNNING = 1,
  ONHOLD = 2,
  FINISHED = 3,
}

export enum KanbanPriority {
  LOW = -1,
  MEDIUM = 0,
  HIGH = 1,
}
export enum KanbanType {
  WEB = 'Website',
  ANDROID = 'Android',
  IPHONE = 'IPhone',
  TESTING = 'Testing',
}

export interface KanbanComment {
  user: string;
  avatar: string;
  date: Date;
  message: string;
}

export interface KanbanMember {
  name: string;
  avatar: string;
}

export class Kanban {
  constructor(
    public id: number,
    public name: string,
    public status: number = KanbanStatus.NEWTASK,
    public description?: string,
    public deadline?: Date,
    public priority: number = KanbanPriority.MEDIUM,
    public open_task?: number,
    public type: string = KanbanType.WEB,
    public created?: Date,
    public team_leader?: string,
    public comments?: number,
    public bugs?: number,
    public progress?: number,
    public members: KanbanMember[] = [],
    public likes: number = 0,
    public commentsList: KanbanComment[] = []
  ) {}
}

export interface RawKanban {
  id: number | string;
  name: string;
  status?: number | string;
  description?: string;
  deadline?: string | Date;
  priority?: number | string;
  open_task?: number;
  type: string;
  created?: string | Date;
  team_leader?: string;
  comments?: number | string;
  bugs?: number | string;
  progress?: number | string;
  members?: (string | RawKanbanMember)[];
  likes?: number | string;
  commentsList?: RawKanbanComment[];
}

export interface RawKanbanMember {
  name: string;
  avatar: string;
}

export interface RawKanbanComment {
  user: string;
  avatar: string;
  date: string | Date;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class KanbanAdapter implements Adapter<Kanban> {
  adapt(item: unknown): Kanban {
    const data = item as RawKanban;
    const adapted = new Kanban(
      Number(data.id),
      data.name,
      data.status ? Number(data.status) : undefined,
      data.description,
      data.deadline ? new Date(data.deadline) : undefined,
      data.priority ? Number(data.priority) : undefined,
      data.open_task,
      data.type,
      data.created ? new Date(data.created) : undefined,
      data.team_leader,
      data.comments ? Number(data.comments) : undefined,
      data.bugs ? Number(data.bugs) : undefined,
      data.progress ? Number(data.progress) : undefined,
      (data.members || []).map((m) => {
        if (typeof m === 'string') {
          return { name: m, avatar: 'assets/images/user/user1.jpg' };
        }
        return m as KanbanMember;
      }),
      data.likes ? Number(data.likes) : 0,
      (data.commentsList || []).map((c) => ({
        ...c,
        date: new Date(c.date),
      }))
    );
    return adapted;
  }
}

