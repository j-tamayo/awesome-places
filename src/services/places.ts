import { Injectable } from '@angular/core';
import { Place } from '../models/place';
import { Location } from '../models/location';

import { Storage } from '@ionic/storage';

@Injectable()
export class PlacesService {
  private places: Place[] = [];

  constructor(private storage: Storage) {

  }

  addPlace(title: string, description: string, location: Location, imageUrl: string){
    const place = new Place(title, description, location, imageUrl);
    this.places.push(place);
    this.storage.set('places', this.places)
    .then()
    .catch(
      err => {
        this.places.splice(this.places.indexOf(place), 1);
      }
    );
  }

  loadPlaces() {
    return this.places.slice();
  }

  fetchPlaces() {
    this.storage.get('places')
    .then(
      (places: Place[]) => {
        this.places = places != null ? places : [];
      }
    )
    .catch(
      err => console.log(err)
    );
  }

  deletePlace(index: number) {
    this.places.splice(index, 1);
  }
}
