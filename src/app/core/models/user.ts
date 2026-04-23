export class User {
  Message: string;
  Requestkey: string;
  Status: string;
  Token: string;
  customer: string;
  driver: string;
  employee: EmployeeData;
  EmployeeEntityPasswordID: string;
  userType: string;
}

export class EmployeeData {
  EmployeeID: number;
  FirstName: string;
  LastName: string;
  RoleID: number;
  Gender: string;
  Mobile: string;
  Email: string;
  ActivationStatus: boolean;
}
