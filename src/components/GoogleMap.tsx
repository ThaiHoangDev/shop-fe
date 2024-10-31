import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from 'react-google-maps';

const MapContainer: React.FC<any> = (props) => {
  const [currentPosition, setCurrentPosition] =
    useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    // Lấy vị trí hiện tại
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('Trình duyệt không hỗ trợ Geolocation.');
    }
  }, []);

  const Map = withScriptjs(
    withGoogleMap(() => (
      <GoogleMap defaultZoom={14} defaultCenter={currentPosition} {...props}>
        {currentPosition && <Marker position={currentPosition} />}
      </GoogleMap>
    ))
  );

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Map
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBNwnUxqtmN13cxHXhRfzpNwzNNTRYzspI&callback=console.debug&libraries=maps,marker&v=beta`}
        loadingElement={<div style={{ height: '100%' }} />}
        containerElement={<div style={{ height: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
      />
    </div>
  );
};

export default MapContainer;
