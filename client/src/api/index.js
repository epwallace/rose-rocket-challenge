import axios from "axios";

export const getRoute = async (origin, destination) => {
  try {
    const res = await axios.get(
      `route?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`
    );
    return res.data.path;
  } catch (err) {
    console.log(err);
    return [];
  }
};
