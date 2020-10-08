import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

// finds out user location

const getLocation = async () => {
  try {
    // permission to get user location
    const {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      // get location
      const userLocation = await Location.getCurrentPositionAsync();
      return userLocation;
    } else {
      console.log('Permission denied');
    }
  } catch (e) {
    console.log(e.message);
  }
};

export {
  getLocation,
};
