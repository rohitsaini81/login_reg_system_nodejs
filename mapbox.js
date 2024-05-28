
const axios = require('axios');
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoicm9oaXRzYWluaTgxIiwiYSI6ImNsdG9qdHF6ODBpY3AyanAzemY0cXQ0ODkifQ.aTsQLC4cNrBoIFzIl7ju2w';


const getDetailsbyCD = "https://api.mapbox.com/geocoding/v5/mapbox.places/-73.9857,40.7484.json?access_token=pk.eyJ1Ijoicm9oaXRzYWluaTgxIiwiYSI6ImNsdG9qdHF6ODBpY3AyanAzemY0cXQ0ODkifQ.aTsQLC4cNrBoIFzIl7ju2w";
// https://api.mapbox.com/directions/v5/mapbox/driving-traffic/76.989625%2C29.680327%3B76.830955%2C30.346605?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1Ijoicm9oaXRzYWluaTgxIiwiYSI6ImNsdG9qdHF6ODBpY3AyanAzemY0cXQ0ODkifQ.aTsQLC4cNrBoIFzIl7ju2w

const mapboxA = async(req) => {
    const { origin, destination } = req.query;

    try {
        const response = await axios.get('https://api.mapbox.com/directions/v5/mapbox/driving', {
            params: {
                access_token: MAPBOX_ACCESS_TOKEN,
                waypoints: `${origin};${destination}`
            }
        });

        const data = response.data;
        const distance = data.routes[0].distance;
        const steps = data.routes[0].legs[0].steps;

        const cities = steps.map(step => step.intersections[0].location);

        res.json({ distance, cities });
    } catch (error) {
        console.error('Error fetching route:', error);
        res.status(500).json({ error: 'Failed to fetch route' });
    }
}

