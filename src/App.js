import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import 'firebase/compat/database';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const firebaseConfig = {
  apiKey: "AIzaSyAHjdB-FWsCPs9WXcMmZzhCiYn9y-xhNAU",
  authDomain: "map-api-b7da5.firebaseapp.com",
  projectId: "map-api-b7da5",
  storageBucket: "map-api-b7da5.appspot.com",
  messagingSenderId: "225622062683",
  appId: "1:225622062683:web:c7c7c810a0406dddde317e",
  measurementId: "G-4VFDWPY31Q"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = firebase.database();
const ref = db.ref('quests');

const App = () => {
  const [markers, setMarkers] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    ref.on('value', (snapshot) => {
      const data = snapshot.val();
      const markersData = Object.values(data).map((quest) => ({
        position: {
          lat: quest.location.latitude,
          lng: quest.location.longitude,
        },
        label: quest.id.toString(),
      }));
      setMarkers(markersData);
    });
  }, []);

  const handleMarkerDragEnd = (e) => {
    const updatedMarkers = [...markers];
    const draggedMarkerIndex = updatedMarkers.findIndex(
      (marker) => marker.label === e.label
    );
    updatedMarkers[draggedMarkerIndex].position = e.position;
    setMarkers(updatedMarkers);
  };

  const handleRemoveAllMarkers = () => {
    setMarkers([]);
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyA1Cc_txwIjkmqPuOK9KML7AKytvoK4bM4',
  });

  if (loadError) return 'Error loading Google Maps';
  if (!isLoaded) return 'Loading Google Maps';

  const mapOptions = {
    zoom: 10,
    center: { lat: 48.46667, lng: 34.64556 },
  };

  return (
    <div>
      {mapLoaded && (
        <GoogleMap
          {...mapOptions}
          mapContainerStyle={{ height: '400px', width: '600px' }}
          onLoad={handleMapLoad}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.label}
              position={marker.position}
              label={marker.label}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
          ))}
        </GoogleMap>
      )}
      <button onClick={handleRemoveAllMarkers}>Видалити всі маркери</button>
    </div>
  );
};

export default App;