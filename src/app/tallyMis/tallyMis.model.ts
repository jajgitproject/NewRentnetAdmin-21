// @ts-nocheck
export class TallyMis {
  billingBranch: string;
  customerServiceLocation: string;
  customerGSTRNo: string;
  bookedBy: string;
  usedBy: string;
  billno: string;
  billDate: string;
  customerName: string;
  customerid: string;
  carHireCharges: string;
  parkingandToll: string;
  netCCProcessingamount: string;
  subtotal: string;
  netSgstAmount: string;
  netCgstAmount: string;
  netIgstAmount: string;
  finalBillAmount: string;
  sgstRate: string;
  cgstRate: string;
  igstRate: string;
  roundOff: string;
  narration: string;
  billAlter: string;
  irnno: string;
  irndate: string;

  constructor(tallyMis) {
    this.billingBranch = tallyMis.billingBranch || '';
    this.customerServiceLocation = tallyMis.customerServiceLocation || '';
    this.customerGSTRNo = tallyMis.customerGSTRNo || '';
    this.bookedBy = tallyMis.bookedBy || '';
    this.usedBy = tallyMis.usedBy || '';
    this.billno = tallyMis.billno || '';
    this.billDate = tallyMis.billDate || '';
    this.customerName = tallyMis.customerName || '';
    this.customerid = tallyMis.customerid || '';
    this.carHireCharges = tallyMis.carHireCharges || '';
    this.parkingandToll = tallyMis.parkingandToll || '';
    this.netCCProcessingamount = tallyMis.netCCProcessingamount || '';
    this.subtotal = tallyMis.subtotal || '';
    this.netSgstAmount = tallyMis.netSgstAmount || '';
    this.netCgstAmount = tallyMis.netCgstAmount || '';
    this.netIgstAmount = tallyMis.netIgstAmount || '';
    this.finalBillAmount = tallyMis.finalBillAmount || '';
    this.sgstRate = tallyMis.sgstRate || '';
    this.cgstRate = tallyMis.cgstRate || '';
    this.igstRate = tallyMis.igstRate || '';
    this.roundOff = tallyMis.roundOff || '';
    this.narration = tallyMis.narration || '';
    this.billAlter = tallyMis.billAlter || '';
    this.irnno = tallyMis.irnno || '';
    this.irndate = tallyMis.irndate || '';
  }
}

