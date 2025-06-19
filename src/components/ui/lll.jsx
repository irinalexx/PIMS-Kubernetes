{/*
{/*MapComponent.jsx
import React, { useState, useEffect, useRef } from "react";
import RegisterComplaint from "../dashboard/RegisterComplaint";

const MapComponent = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GOOGLE_MAPS_API_KEY = "AIzaSyChisU23cNJZXwwyJNTlzWSWIgfhluSCqI"; // 🔹 Replace with your API Key

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google || !mapRef.current) return;

      const defaultCenter = { lat: 10.8505, lng: 76.2711 };

      const newMap = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 15,
        mapTypeControl: false,
        fullscreenControl: false,
      });

      setMap(newMap);

      const newSearchBox = new window.google.maps.places.SearchBox(searchInputRef.current);
      newMap.controls[window.google.maps.ControlPosition.TOP_LEFT].push(searchInputRef.current);

      newMap.addListener("bounds_changed", () => {
        newSearchBox.setBounds(newMap.getBounds());
      });

      newSearchBox.addListener("places_changed", () => {
        const places = newSearchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        if (!place.geometry || !place.geometry.location) return;

        updateMarker(place.geometry.location, newMap);

        if (place.geometry.viewport) {
          newMap.fitBounds(place.geometry.viewport);
        } else {
          newMap.setCenter(place.geometry.location);
          newMap.setZoom(17);
        }
      });

      newMap.addListener("click", (event) => {
        updateMarker(event.latLng, newMap);
      });

      getCurrentLocation(newMap);

      setLoading(false);
    };

    const getCurrentLocation = (newMap) => {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          updateMarker(userLocation, newMap);
          newMap.setCenter(userLocation);
          newMap.setZoom(17);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    };

    const updateMarker = (location, newMap) => {
      if (!newMap) return;

      if (marker) marker.setMap(null);

      const newMarker = new window.google.maps.Marker({
        position: location,
        map: newMap,
        animation: window.google.maps.Animation.DROP,
      });

      setMarker(newMarker);

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results[0]) {
          onLocationSelect({
            address: results[0].formatted_address,
            latitude: location.lat(),
            longitude: location.lng(),
          });
        } else {
          onLocationSelect({
            address: "Location Not Found",
            latitude: location.lat(),
            longitude: location.lng(),
          });
        }
      });
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = loadGoogleMaps;
      script.onerror = () => setError("Google Maps failed to load. Check API key.");
      document.head.appendChild(script);
    } else {
      loadGoogleMaps();
    }
  }, []);

  return (
    <div className="map-container" style={{ width: "100%", height: "400px", position: "relative" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search location..."
        className="search-box"
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: "1000",
          padding: "8px",
          width: "80%",
          maxWidth: "400px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      
      {loading && <p>Loading Map...</p>}
    </div>
  );
};

export default MapComponent;


{/*RegisterComplaint
import React, { useState } from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import { MdOutlineAttachFile } from 'react-icons/md';
import { ref, push } from "firebase/database";
import { realtimeDb } from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

export default function RegisterComplaint() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const defaultCenter = { lat: 9.4871, lng: 76.5690 }; // Default to Kanjirappally
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };
  
  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };
  const { currentUser } = useAuth();

  const categories = [
    'Streetlight & Electrical Issues',
    'Road Infrastructure Issues',
    'Water & Pipeline Issues',
    'Vegetation & Environmental Issues',
    'Wildlife Disturbance Reporting'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You need to be logged in to submit a complaint.");
      return;
    }

    try {
      const complaintsRef = ref(realtimeDb, "complaints");
      const newComplaint = {
        userId: currentUser.uid,
        category: selectedCategory,
        description,
        location,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      };
      await push(complaintsRef, newComplaint);
      alert("Complaint submitted successfully!");
      setSelectedCategory('');
      setDescription('');
      setLocation('');
      setFile(null);
    } catch (error) {
      console.error("Error submitting complaint:", error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setSelectedPosition({ lat: latitude, lng: longitude });
          setLocation(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleMapClick = (e) => {
    const clickedPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setSelectedPosition(clickedPosition);
    setLocation(`${clickedPosition.lat}, ${clickedPosition.lng}`);
  };

  const handlePlaceSelect = (place) => {
    if (place.geometry) {
      const { lat, lng } = place.geometry.location;
      const selectedPosition = { lat: lat(), lng: lng() };
      setSelectedPosition(selectedPosition);
      setLocation(`${lat()}, ${lng()}`);
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDzNCyt48_WEXbnZ4K-NOQZUmErHnuu0JU" libraries={['places']}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-8">Register a New Complaint</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Category 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Issue Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Description 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed description of the issue"
              rows={6}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Location 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="relative">
              <IoLocationOutline className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <Autocomplete onLoad={(autocomplete) => console.log('Autocomplete loaded')} onPlaceChanged={() => handlePlaceSelect(autocomplete.getPlace())}>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter specific location"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </Autocomplete>
            </div>
          </div>

          

          {/* Map 
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setMapVisible(!mapVisible)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2"
            >
              {mapVisible ? 'Hide Map' : 'Show Map'}
            </button>

            {mapVisible && (
              <div>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
                >
                  Use Current Location
                </button>

                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={selectedPosition || currentLocation || defaultCenter}
                  zoom={12} // Zoom in closer to Kanjirappally
                  options={options}
                  onClick={handleMapClick}
                >
                  {selectedPosition && <Marker position={selectedPosition} />}
                </GoogleMap>
              </div>
            )}
          </div>

          {/* Submit Button 
          <button
            type="submit"
            className="w-full bg-blue-600 text-black py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Complaint
          </button>
        </form>
      </div>
    </LoadScript>
  );
}
*/}