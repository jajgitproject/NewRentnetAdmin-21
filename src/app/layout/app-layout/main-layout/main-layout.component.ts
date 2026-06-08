// @ts-nocheck
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionHeartbeatService } from 'src/app/core/service/session-heartbeat.service';

@Component({
  standalone: false,
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: []
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  constructor(private sessionHeartbeatService: SessionHeartbeatService) {}

  ngOnInit(): void {
    this.sessionHeartbeatService.start();
  }

  ngOnDestroy(): void {
    this.sessionHeartbeatService.stop();
  }
}


