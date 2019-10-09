import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DataSvcService {

  constructor() { }

  getData(count) {
    var data = [],
      i = 0,
      countryId,
      productId;
    var _products = ['Widget', 'Gadget', 'Doohickey'];
    var _countries = ['US', 'Germany', 'UK', 'Japan', 'Italy', 'Greece'];

    for (var i = 0; i < count; i++) {
      countryId = Math.floor(Math.random() * _countries.length);
      productId = Math.floor(Math.random() * _products.length);
      data.push({
        id: i,
        country: _countries[countryId],
        product: _products[productId],
        date: new Date(2014, i % 12, i % 28),
        amount: Math.random() * 10000,
        active: i % 4 === 0
      });
    }
    return data;
  }

  getTreeData() {
    let data = [
      {
        name: 'Washington', type: 'state', population: 6971, cities: [
          { name: 'Seattle', type: 'city', population: 652 },
          { name: 'Spokane', type: 'city', population: 210 }
        ]
      },
      {
        name: 'Oregon', type: 'state', population: 3930, cities: [
          { name: 'Portland', type: 'city', population: 609 },
          { name: 'Eugene', type: 'city', population: 159 }
        ]
      },
      {
        name: 'California', type: 'state', population: 38330, cities: [
          { name: 'Los Angeles', type: 'city', population: 3884 },
          { name: 'San Diego', type: 'city', population: 1356 },
          { name: 'San Francisco', type: 'city', population: 837 , cities: [
            { name: 'Mumbai', type: 'city', population: 3884 },
            { name: 'Abc', type: 'city', population: 1356 },
          ]}
        ]
      },
      { name: 'Delhi', type: 'city', population: 6000 },
      { name: 'Lucknow', type: 'city', population: 5000 }
    ];
    return data;
  }

}