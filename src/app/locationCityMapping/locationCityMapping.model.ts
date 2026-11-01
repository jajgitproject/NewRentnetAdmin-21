// @ts-nocheck
export class LocationCityMappingModel {
  locationCityMappingID: number;
  locationID: number;
  locationName: string;
  cityID: number;
  city: string;
  mappedCities: string;
  activationStatus: boolean;
  userID: number;
  cityIDs: number[];
  locationCityMappingIDs: number[];

  constructor(model) {
    this.locationCityMappingID = model.locationCityMappingID || -1;
    this.locationID = model.locationID || 0;
    this.locationName = model.locationName || '';
    this.cityID = model.cityID || 0;
    this.city = model.city || '';
    this.mappedCities = model.mappedCities || '';
    this.activationStatus = model.activationStatus;
    this.cityIDs = model.cityIDs || [];
    this.locationCityMappingIDs = model.locationCityMappingIDs || [];
  }
}
