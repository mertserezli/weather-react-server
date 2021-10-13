require('dotenv').config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());

const api = {
    key: process.env.REACT_APP_WEATHER_API_KEY,
    base: "https://api.openweathermap.org/data/2.5/weather"
};

app.get("/weather", async (req, res) => {
    const q = req.query.query;

    const { data } = await axios.get(
        api.base,
        { params: { q, units: "metric", APPID: api.key} }
    );

    res.json(data)
});

app.listen(3000);