import { Component, Input, OnInit } from '@angular/core';
import { Feature, Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import { Observable } from 'rxjs';
import Popup from 'ol-ext/overlay/Popup';
import { LabsData } from 'src/app/models/labs-data.model';
import Select from 'ol/interaction/Select';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Geometry, Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() labsDataObservable: Observable<LabsData>;

  coords: number[] = [0, 0];
  labsData: LabsData;
  map: Map;
  markerLayer: VectorLayer<VectorSource<Geometry>>;
  popup: Popup;
  select: Select;
  zoom: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.initMap();
    this.handleLabsData();
  }

  handleLabsData(): void {
    this.labsDataObservable.subscribe({
      next: (data: LabsData) => {
        this.labsData = data;
        this.setMapCenter();
        this.setMapZoom();
        this.popup.hide();
        this.refreshMap();
        this.markerLayer.setSource(this.getVectorSource());
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  initMap(): void {
    const mapLayer = this.getTileLayer();
    this.markerLayer = this.getMarkerLayer();
    this.popup = this.getPopup();

    this.map = new Map({
      layers: [mapLayer, this.markerLayer],
      overlays: [this.popup],
      target: 'ol-map',
      view: new View({
        center: this.coords,
        zoom: this.zoom,
      }),
    });

    this.select = this.getMapSelectIcon();
    this.map.addInteraction(this.select);

    this.handleMapEvents();
    this.handleMarkerEvents();
  }

  getTileLayer(): TileLayer<OSM> {
    return new TileLayer({
      source: new OSM(),
      preload: Infinity,
    });
  }

  getMarkerLayer(): VectorLayer<VectorSource<Geometry>> {
    return new VectorLayer({
      source: this.getVectorSource(),
      style: this.getPointStyleIcon(),
    });
  }

  getVectorSource(): VectorSource<Geometry> {
    const vectorSource = new VectorSource({ features: [] });
    this.addPointsToVectorSource(vectorSource);
    return vectorSource;
  }

  addPointsToVectorSource(vectorSource: VectorSource<Geometry>): void {
    if (this.labsData) {
      this.labsData.laboatoria.forEach((lab) => {
        const point = new Feature({
          geometry: new Point(fromLonLat([lab.gps_lng, lab.gps_lat])),
        });
        point.setProperties({
          name: lab.nazwa,
          address: `
            <div>${lab.adres}</div>
            <div>${lab.kod_pocztowy}, ${lab.miejscowosc}</div>
          `,
          info: lab.info ? `<div>Informacje: ${lab.info}</div>` : lab.info,
        });
        vectorSource.addFeature(point);
      });
    }
  }

  setMapCenter(): void {
    this.coords = fromLonLat([
      this.labsData.cords.avg_lng,
      this.labsData.cords.avg_lat,
    ]);
  }

  setMapZoom(): void {
    this.zoom = this.labsData.cords.zoom;
  }

  refreshMap(): void {
    this.map.getView().animate({
      center: this.coords,
      duration: 1000,
    });
    this.map.getView().animate({
      zoom: this.zoom,
      duration: 1000,
    });
  }

  getPointStyleIcon(): Style {
    return new Style({
      image: new Icon({
        color: '#004696',
        crossOrigin: 'anonymous',
        src: 'assets/icons/circle.svg',
        scale: [0.15, 0.15],
      }),
    });
  }

  getPopup(): Popup {
    return new Popup({
      popupClass: 'default anim',
      positioning: 'auto',
      autoPan: true,
      autoPanAnimation: { duration: 250 },
    });
  }

  getMapSelectIcon(): Select {
    return new Select({
      style: this.getPointStyleIcon(),
    });
  }

  handleMapEvents(): void {
    this.mapOnPointerMove();
  }

  mapOnPointerMove(): void {
    this.map.on('pointermove', (e) => {
      const hit = this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
        return true;
      });
      if (hit) {
        this.map.getTargetElement().style.cursor = 'pointer';
      } else {
        this.map.getTargetElement().style.cursor = '';
      }
    });
  }

  handleMarkerEvents(): void {
    this.onMarkerSelect();
    this.onMarkerDeselect();
  }

  onMarkerSelect(): void {
    this.select.getFeatures().on('add', (e) => {
      e.preventDefault();
      const feature = e.element;
      const featureProperties = this.getFeatureProperties(feature);
      this.preparePopupData(feature, featureProperties);
    });
  }

  getFeatureProperties(feature: Feature): any {
    return feature.getProperties();
  }

  preparePopupData(feature: any, featureProperties: any): void {
    const content = `
      <h4>${featureProperties.name}</h4>
      <div>${featureProperties.address}</div>
      <div>${featureProperties.info ? featureProperties.info : ''}</div>
    `;
    this.popup.show(feature.getGeometry().getCoordinates(), content);
  }

  onMarkerDeselect(): void {
    this.select.getFeatures().on('remove', (e) => {
      this.popup.hide();
    });
  }
}
