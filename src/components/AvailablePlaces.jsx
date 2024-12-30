import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
import { useFetch } from "../hooks/useFetch.js";

async function fetchPlaces() {
  const places = await fetchAvailablePlaces();

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortPlaces = sortPlacesByDistance(
        places,
        position.coords.latitude,
        position.coords.longitude
      );

      resolve(sortPlaces);
    });
  });
}

export default function AvailablePlaces({ onSelectPlace }) {
  // const [isFetching, setisFetching] = useState(false);
  // const [availablePlaces, setAvailablePlaces] = useState([]);
  // const [error, setError] = useState();

  const {
    error,
    isLoading: isFetching,
    data: availablePlaces,
  } = useFetch(fetchPlaces, []);

  if (error) {
    return <Error title="An Error occured" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="fetching Available Places... "
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
