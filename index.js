import express from "express";
import axios from "axios";
import polyline from "google-polyline";

const PORT = 4000;
const app = express();
const key = "AIzaSyBp8nFSp3hZPV-np6jNSR2I73BO2jCcr8A";

// compute polyline route from the given origin and destination
app.get("/route", async (req, res) => {
  try {
    const { origin, destination } = req.query;
    const target = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${key}`;

    const rawData = await axios.get(target);

    // convert encoded polyline string to [LatLng]
    const encodedPolyline = rawData.data.routes[0].overview_polyline.points;
    const points = polyline.decode(encodedPolyline).map((x) => {
      return { lat: x[0], lng: x[1] };
    });

    return res.status(200).json({ path: points });
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
