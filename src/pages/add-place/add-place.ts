import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  LoadingController,
  ToastController
} from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { SetLocationPage } from '../set-location/set-location';

import { PlacesService } from '../../services/places';

import { Location } from '../../models/location';

@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  location: Location = {
    lat: 40.7624324,
    lng: -73.9759827
  };
  locationIsSet = false;
  imageUrl = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private camera: Camera,
    private placesService: PlacesService
  ) {
  }

  onSubmit(form: NgForm) {
    this.placesService.addPlace(
      form.value.title,
      form.value.description,
      this.location,
      this.imageUrl
    );

    form.reset();

    this.location = {
      lat: 40.7624324,
      lng: -73.9759827
    };
    this.imageUrl = '';
    this.locationIsSet = false;
  }

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, {location: this.location, isSet: this.locationIsSet});
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          this.location = data.location;
          this.locationIsSet = true;
        }
      }
    )
  }

  onLocate() {
    const loader = this.loadingCtrl.create({
      content: 'Getting your Location...'
    });
    loader.present();

    this.geolocation.getCurrentPosition()
    .then(
      location => {
        console.log(location);
        loader.dismiss();
        this.location.lat = location.coords.latitude;
        this.location.lng = location.coords.longitude;
        this.locationIsSet = true;
      }
    )
    .catch(
      error => {
        loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Could not get location, please pick it manually',
          duration: 3000
        });
        toast.present();
        console.log(error);
      }
    )
  }

  onTakePhoto() {
    const options: CameraOptions = {
      quality: 100,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };

    this.camera.getPicture(options)
    .then((imageData) => {
      this.imageUrl = imageData;
    },
    (err) => {

    });
  }

}
