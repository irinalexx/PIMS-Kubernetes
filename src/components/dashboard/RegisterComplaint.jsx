import React, { useState, useRef, useEffect } from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import { MdOutlineAttachFile } from 'react-icons/md';
import { ref, push } from "firebase/database";
import { realtimeDb } from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterComplaint() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const searchInputRef = useRef(null);  // ✅ Fix for "searchInputRef is not defined"

  const { currentUser } = useAuth();

  const categories = [
    'Streetlight & Electrical Issues',
    'Road Infrastructure Issues',
    'Water & Pipeline Issues',
    'Vegetation & Environmental Issues',
    'Wildlife Disturbance Reporting'
  ];

  useEffect(() => {
    if (!showMap) return;

    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAd9H-eHez9E8oFtgoPdoVWwIKAuBKECHg&libraries=places,marker";
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) return;
    
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 10.8505, lng: 76.2711 }, // Default Kerala
        zoom: 15,
      });
    
      const marker = new window.google.maps.Marker({
        position: { lat: 10.8505, lng: 76.2711 }, // Default to Kerala
        map: map,
        draggable: true,
      });
    
      markerRef.current = marker;
    
      // ✅ Fetch and set current location if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            map.setCenter(pos);
            marker.setPosition(pos);
            updateLocation(pos); // ✅ Update location in input field
          },
          () => {
            alert("Geolocation failed. Please enter location manually.");
          }
        );
      }
    
      // ✅ Add Search Box  
      const searchBox = new window.google.maps.places.SearchBox(searchInputRef.current);
      map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(searchInputRef.current);
    
      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;
    
        const place = places[0];
        if (!place.geometry || !place.geometry.location) return;
    
        map.setCenter(place.geometry.location);
        marker.setPosition(place.geometry.location);
        updateLocation(place.geometry.location, place.formatted_address);
      });
    
      // ✅ Allow marker drag to update location  
      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        updateLocation({ lat: position.lat(), lng: position.lng() });
      });
    };
    
    // ✅ Helper function to update the location field
    const updateLocation = (position, address = null) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === "OK" && results[0]) {
          setLocation({
            address: address || results[0].formatted_address,
            latitude: position.lat,
            longitude: position.lng,
          });
        } else {
          setLocation({
            address: "Unknown Location",
            latitude: position.lat,
            longitude: position.lng,
          });
        }
      });
    };
    

    loadGoogleMaps();
  }, [showMap]);

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
        address: location.address || "No address provided", 
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date().toISOString(),
      };

      await push(complaintsRef, newComplaint);
      alert("Complaint submitted successfully!");

      setSelectedCategory('');
      setDescription('');
      setLocation({ address: "", latitude: null, longitude: null });
      setFile(null);
      setShowMap(false);
    } catch (error) {
      console.error("Error submitting complaint:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">
        Register a New Complaint
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Issue Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Issue Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide detailed description of the issue"
            rows={6}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="relative">
            <IoLocationOutline onClick={() => setShowMap(true)} className="absolute left-3 top-3 text-gray-400 w-5 h-5 cursor-pointer" />
            <input type="text" value={location.address} placeholder="Select location" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300" readOnly />
          </div>
        </div>

        {/* Map Popup */}
        {showMap && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-full max-w-2xl relative">
              <button 
                onClick={() => setShowMap(false)} 
                className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg">
                X
              </button>

              {/* 📌 Search Input */}
              <input 
                ref={searchInputRef} 
                type="text" 
                placeholder="Search location..." 
                className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md"
              />

              {/* 📌 Google Map */}
              <div ref={mapRef} style={{ height: "400px", width: "100%" }} />

              {/* ✅ Button to Save Selected Location */}
              <button 
                onClick={() => { 
                  if (markerRef.current) {
                    const position = markerRef.current.getPosition();
                    setLocation({
                      address: location.address || "No address provided",
                      latitude: position.lat(),
                      longitude: position.lng(),
                    });
                  }
                  setShowMap(false);
                }} 
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg w-full"
              >
                Set Location
              </button>

            </div>
          </div>
        )}

        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-black py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Complaint
        </button>
        </form>

    </div>
  );
}