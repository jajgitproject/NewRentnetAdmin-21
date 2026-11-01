// @ts-nocheck
export class CustomerMeeting {
  customerMeetingID: number;
  customerGroupID: number;
  customerGroup: string;
  employeeID: number;
  employeeName: string;
  modeOfMeeting: string;
  meetingDate: Date;
  meetingDateString: string;
  metWithName: string;
  metWithDesignation: string;
  meetingSubject: string;
  meetingDetails: string;
  recordCreatedOnDate: Date;
  recordCreatedOnDateString: string;
  recordCreatedOnTime: Date;
  recordCreatedOnTimeString: string;
  recordCreatedByID: number;
  recordCreatedByName: string;
  meetingStatus: string;
  meetingStatusRemark: string;
  userID: number;

  constructor(customerMeeting) {
    this.customerMeetingID = customerMeeting.customerMeetingID ?? -1;
    this.customerGroupID = customerMeeting.customerGroupID || 0;
    this.customerGroup = customerMeeting.customerGroup || '';
    this.employeeID = customerMeeting.employeeID || 0;
    this.employeeName = customerMeeting.employeeName || '';
    this.modeOfMeeting = customerMeeting.modeOfMeeting || '';
    this.meetingDate = customerMeeting.meetingDate || null;
    this.meetingDateString = customerMeeting.meetingDateString || '';
    this.metWithName = customerMeeting.metWithName || '';
    this.metWithDesignation = customerMeeting.metWithDesignation || '';
    this.meetingSubject = customerMeeting.meetingSubject || '';
    this.meetingDetails = customerMeeting.meetingDetails || '';
    this.recordCreatedOnDate = customerMeeting.recordCreatedOnDate || null;
    this.recordCreatedOnDateString = customerMeeting.recordCreatedOnDateString || '';
    this.recordCreatedOnTime = customerMeeting.recordCreatedOnTime || null;
    this.recordCreatedOnTimeString = customerMeeting.recordCreatedOnTimeString || '';
    this.recordCreatedByID = customerMeeting.recordCreatedByID || 0;
    this.recordCreatedByName = customerMeeting.recordCreatedByName || '';
    this.meetingStatus = customerMeeting.meetingStatus || '';
    this.meetingStatusRemark = customerMeeting.meetingStatusRemark || '';
    this.userID = customerMeeting.userID || 0;
  }
}

export class CustomerMeetingStatus {
  customerMeetingID: number;
  meetingStatus: string;
  meetingStatusRemark: string;
  userID: number;

  constructor(status) {
    this.customerMeetingID = status.customerMeetingID || 0;
    this.meetingStatus = status.meetingStatus || '';
    this.meetingStatusRemark = status.meetingStatusRemark || '';
    this.userID = status.userID || 0;
  }
}

export class CustomerMeetingRemark {
  customerMeetingRemarkID: number;
  customerMeetingID: number;
  remarkByID: number;
  remarkByName: string;
  remark: string;
  remarkDate: Date;
  remarkDateString: string;
  remarkTime: Date;
  remarkTimeString: string;
  activationStatus: boolean;
  userID: number;

  constructor(remark) {
    this.customerMeetingRemarkID = remark.customerMeetingRemarkID || -1;
    this.customerMeetingID = remark.customerMeetingID || 0;
    this.remarkByID = remark.remarkByID || 0;
    this.remarkByName = remark.remarkByName || '';
    this.remark = remark.remark || '';
    this.remarkDate = remark.remarkDate || null;
    this.remarkDateString = remark.remarkDateString || '';
    this.remarkTime = remark.remarkTime || null;
    this.remarkTimeString = remark.remarkTimeString || '';
    this.activationStatus = remark.activationStatus !== undefined ? remark.activationStatus : true;
    this.userID = remark.userID || 0;
  }
}
