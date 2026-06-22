// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContractPackageTypePackageMapping {
  customerContractPackageTypePackageMappingID: number;
  customerContractPackageTypeID: number;
  customerContractName: string;
  customerPackageName: string;
  customerPackageCodeForIntegration: string;
  packageID: number;
  activationStatus: boolean;
  package: string;
  userID: number;
  customerContractID: number;
  constructor(customerContractPackageTypePackageMapping) {
    {
      this.customerContractPackageTypePackageMappingID = customerContractPackageTypePackageMapping.customerContractPackageTypePackageMappingID || -1;
      this.customerContractPackageTypeID = customerContractPackageTypePackageMapping.customerContractPackageTypeID || '';
      this.customerContractID = customerContractPackageTypePackageMapping.customerContractID || '';
      this.packageID = customerContractPackageTypePackageMapping.packageID || '';
      this.customerContractName = customerContractPackageTypePackageMapping.customerContractName || '';
      this.customerPackageName = customerContractPackageTypePackageMapping.customerPackageName || '';
      this.customerPackageCodeForIntegration = customerContractPackageTypePackageMapping.customerPackageCodeForIntegration || '';
      this.activationStatus = customerContractPackageTypePackageMapping.activationStatus || '';
      this.package = customerContractPackageTypePackageMapping.package || '';
    }
  }
}
