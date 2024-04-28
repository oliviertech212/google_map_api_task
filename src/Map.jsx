import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { IoMenu } from "react-icons/io5";
import { getDistance } from "geolib";

const libraries = ["places", "directions"];

const Map = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries,
  });
  const [hidemenu, setHidemenu] = useState(false);
  const [directions, setDirections] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nextStop, setNextStop] = useState(0);
  const [distanceToNextStop, setDistanceToNextStop] = useState(null);
  const [timeToNextStop, setTimeToNextStop] = useState(null);

  const [nextStopName, setNextStopName] = useState("");
  // const stops = [
  //   { lat: -1.939826787816454, lng: 30.0445426438232 }, // Starting Point: Nyabugogo
  //   { lat: -1.9355377074007851, lng: 30.060163829002217 }, // Stop A
  //   { lat: -1.9358808342336546, lng: 30.08024820994666 }, // Stop B
  //   { lat: -1.9489196023037583, lng: 30.092607828989397 }, // Stop C
  //   { lat: -1.9592132952818164, lng: 30.106684061788073 }, // Stop D
  //   { lat: -1.9487480402200394, lng: 30.126596781356923 }, // Stop E
  //   { lat: -1.9365670876910166, lng: 30.13020167024439 }, // Ending Point: Kimironko
  // ];

  const stops = [
    { lat: -1.9675632902588955, lng: 30.06715805248569 },
    { lat: -1.963570990711944, lng: 30.060070967805924 },
    { lat: -1.9646810122888905, lng: 30.062852408309627 },
    { lat: -1.9566332658144245, lng: 30.064215796977617 },
  ];
  const averageSpeed = 40; // average speed is 40 km/h
  const directionsService = useRef(null);

  // Get the driver's current location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Update the next stop when the driver reaches a stop
  useEffect(() => {
    if (currentLocation && nextStop < stops.length) {
      const distanceToNextStop = calculateDistance(
        currentLocation,
        stops[nextStop]
      );
      if (distanceToNextStop < 50) {
        // If the driver is within 50 meters of the stop
        setNextStop(nextStop + 1);
      }
    }
  }, [currentLocation]);

  // Calculate the distance between two points
  const calculateDistance = (point1, point2) => {
    const distanceInMeters = getDistance(point1, point2);
    if (distanceInMeters < 1000) {
      return `${distanceInMeters} meters`;
    } else {
      return `${(distanceInMeters / 1000).toFixed(2)} km`;
    }
  };

  // Calculate the ETA for the next stop
  const calculateETA = () => {
    if (currentLocation && nextStop < stops.length) {
      const distanceInMeters = getDistance(currentLocation, stops[nextStop]);
      const timeInHours = distanceInMeters / (averageSpeed * 1000);
      if (timeInHours < 1 / 60) {
        return `${(timeInHours * 3600).toFixed(2)} seconds`;
      } else if (timeInHours < 1) {
        return `${(timeInHours * 60).toFixed(2)} minutes`;
      } else {
        return `${timeInHours.toFixed(2)} hours`;
      }
    }
    return null;
  };

  const calculateRoute = () => {
    const directionsService = new window.google.maps.DirectionsService();
    const waypoints = stops.slice(1, stops.length - 1).map((stop) => ({
      location: stop,
      stopover: true,
    }));
    directionsService.route(
      {
        origin: stops[0],
        destination: stops[stops.length - 1],
        travelMode: window.google.maps.TravelMode.DRIVING,
        waypoints: waypoints,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          const leg = result.routes[0].legs[0];
          setDistanceToNextStop(leg.distance.text);
          setTimeToNextStop(leg.duration.text);

          setNextStopName(leg.end_address);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  }, [isLoaded]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" md:flex w-[100vw] h-[100vh]  bg-white">
      <div className="  md:hidden flex items-center  justify-between h-16 p-5   bg-gradient-to-r from-cyan-300 to-green-500  ">
        <IoMenu size={30} className="" onClick={() => setHidemenu(!hidemenu)} />

        <h2 className="font-bold  text-2xl">StartUp</h2>
      </div>

      {hidemenu && (
        <div className=" md:hidden relative w-full md:w-1/4 border rounded-md p-5 shadow-md md:bg-white">
          <div className="w-full  font-bold  text-2xl space-x-3 flex m-auto mt-3 ">
            <h2>Nyabugogo</h2> <span>-</span> <h2>Kimironko</h2>
          </div>

          <div className="w-full font-semibold mt-3 ">
            <div className="flex w-full justify-between">
              <h2>Next stop : {nextStopName}</h2>
            </div>
            <div className="flex w-full justify-between">
              <h2>Distance : {distanceToNextStop}</h2>
              <h2>Time : {timeToNextStop}</h2>
            </div>
          </div>

          <div className="my-3"></div>
          <div>ETA to next stop: {calculateETA()} </div>
        </div>
      )}
      <div className="  bg-gradient-to-r from-cyan-300 to-green-500 hidden md:block relative w-full md:w-1/4 border rounded-md p-5 shadow-md md:bg-white">
        <div className="w-full  font-bold  text-2xl space-x-3 flex m-auto mt-3 ">
          <h2>Nyabugogo</h2> <span>-</span> <h2>Kimironko</h2>
        </div>

        <div className="w-full font-semibold mt-3 ">
          <div className="flex w-full justify-between">
            <h2>Next stop : {nextStopName}</h2>
          </div>
          <div className="flex w-full justify-between">
            <h2>Distance : {distanceToNextStop}</h2>
            <h2>Time : {timeToNextStop}</h2>
          </div>
        </div>

        <div className="my-3"></div>

        <div>ETA to next stop: {calculateETA()} </div>
      </div>
      <div className=" h-[100%] w-[100%] ">
        <GoogleMap
          center={stops[0]}
          zoom={10}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          {directions && <DirectionsRenderer directions={directions} />}
          {stops.map((stop, index) => (
            <Marker key={index} position={stop} />
          ))}
          {currentLocation && (
            <Marker
              position={currentLocation}
              icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Map;
