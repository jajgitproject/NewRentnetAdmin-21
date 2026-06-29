// @ts-nocheck
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionHeartbeatService } from 'src/app/core/service/session-heartbeat.service';
import { SessionTokenService } from 'src/app/core/service/session-token.service';

@Component({
  standalone: false,
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: []
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  constructor(
    private sessionHeartbeatService: SessionHeartbeatService,
    private sessionTokenService: SessionTokenService
  ) {}

  ngOnInit(): void {
    this.sessionTokenService.startProactiveRefreshScheduling();
    this.sessionHeartbeatService.start();
  }

  ngOnDestroy(): void {
    this.sessionHeartbeatService.stop();
  }
}


