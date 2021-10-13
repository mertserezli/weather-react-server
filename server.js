require('dotenv').config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3000;

const api = {
    key: process.env.REACT_APP_WEATHER_API_KEY,
    base: "https://api.openweathermap.org/data/2.5/weather"
};

app.get("/weather", async (req, res) => {
    const q = req.query.query;

    const { data } = await axios.get(
        api.base,
        { params: { q, units: "metric", APPID: api.key} }
    ).catch(e => res.json({message: "city not found"}));

    res.json(data)
});

app.listen(PORT);
