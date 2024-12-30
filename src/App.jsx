import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { updateUserPlaces, fetchUserPlaces } from "./http.js";
import Error from "./components/Error.jsx";

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, seterror] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchUserPlaces() {
      setIsLoading(true);
      try {
        const userPlaces = await fetchUserPlaces();
        setUserPlaces(userPlaces);
      } catch (error) {
        seterror({
          message:
            error.message || "Could not fetch places, please try again later",
        });
      }
      setIsLoading(false);
    }

    fetchUserPlaces();
  }, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      const dataUpdated = await updateUserPlaces([
        selectedPlace,
        ...userPlaces,
      ]);
    } catch (error) {
      seterror({
        message:
          error.message || "Could not fetch places, please try again later",
      });
      setUserPlaces(userPlaces);
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );

      try {
        const newPlaces = userPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        );
        await updateUserPlaces(newPlaces);
      } catch (error) {
        seterror({
          message:
            error.message || "Could not fetch places, please try again later",
        });
        setUserPlaces(userPlaces);
      }

      setModalIsOpen(false);
    },
    [userPlaces]
  );

  function handleError() {
    seterror(null);
  }

  return (
    <>
      <Modal open={error} onClose={handleError}>
        {error && (
          <Error
            title="An Error occured"
            message={error.message}
            onConfirm={handleError}
          />
        )}
        ;
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error ? (
          <Error title="An Error occured" message={error.message} />
        ) : (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            loadingText="fetching user places"
            isLoading={isLoading}
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
