// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContractPackageType {
  customerContractPackageTypeID: number;
  customerContractID: number;
  customerContractPackageType: string;
  customerContractName: string;
  activationStatus: boolean;
  userID: number;
  packageTypeID: number;
  constructor(customerContractPackageType) {
    {
      this.customerContractPackageTypeID = customerContractPackageType.customerContractPackageTypeID || -1;
      this.customerContractID = customerContractPackageType.customerContractID || 0;
      this.customerContractPackageType = customerContractPackageType.customerContractPackageType || '';
      this.customerContractName = customerContractPackageType.customerContractName || '';
      this.activationStatus = customerContractPackageType.activationStatus || '';
      this.packageTypeID = customerContractPackageType.packageTypeID || 0;
      this.userID = customerContractPackageType.userID || 0;
    }
  }
}
