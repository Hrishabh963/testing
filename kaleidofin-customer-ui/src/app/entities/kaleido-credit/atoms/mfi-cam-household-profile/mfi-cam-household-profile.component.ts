import { Component, Input } from "@angular/core";

@Component({
  selector: "app-mfi-cam-household-profile",
  templateUrl: "./mfi-cam-household-profile.component.html",
  styleUrls: [
    "./mfi-cam-household-profile.component.scss",
    "../cams-report/cams-report.component.scss",
  ],
})
export class MfiCamHouseholdProfileComponent {
  @Input() houseHoldProfile: any = {};
  assetsAvailabilty: any = {
    livestock: "Livestock",
    landOrHouseOtherThanResiding: "Land or House Other Than Residing",
    vehicle: "Vehicle",
    smartphone: "Smartphone",
    television: "TV",
    refrigerator: "Regrigerator",
    airCooler: "Cooler",
    airConditioner: "AC",
    washingMachine: "Washing Machine",
    furniture: "Furniture",
  };

  amenitiesAvailability: any = {
    electricity: "Electricity",
    lpg: "LPG",
    water: "Water",
    toilet: "Toilet",
    sewage: "Sewage",
  };

  tableRow: Array<any> = [
    { title: "Type of Accommodation", propertyKey: "typeOfAccommodation" },
    {
      title:
        "Availability of other assets (Land, Livestock, Vehicle, furniture, smartphone, electronic item etc)",
      propertyKey: "assetsAvailability",
      type: "availability",
      viewMapper: "assetsAvailabilty",
    },
    { title: "Condition of House", propertyKey: "conditionOfHouse" },
    { title: "Type of Shop (If Applicable)", propertyKey: "typeOfShop" },
    {
      title:
        "Basic Amenities available (Electricity, LPG, Water, Toilet, Sewage etc.,)",
      propertyKey: "basicAmenitiesAvailability",
      type: "availability",
      viewMapper: "amenitiesAvailability",
    },
    {
      title: "Children Education level",
      propertyKey: "childrenEducationLevel",
    },
    {
      title: "Neighbour Reference (Positive/Negative) and Name, Mobile Number",
      type: "neighbour",
    },
  ];

  getAvailabilityStatus(
    availabilityData: any = {},
    viewMapper: string = ""
  ): Array<string> {
    const available: Array<string> = new Array<string>();
    const availabilityMap = this[viewMapper];
    for (const key in availabilityData) {
      if (Object.prototype.hasOwnProperty.call(availabilityData, key)) {
        const status: string = availabilityData[key];
        if (status.toLowerCase() === "available") {
          available.push(availabilityMap[key]);
        }
      }
    }
    return available;
  }
}
