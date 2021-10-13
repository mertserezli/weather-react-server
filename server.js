require('dotenv').config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const { Tedis, TedisPool } = require("tedis");

const tedis = new Tedis({
    port: 18052,
    host: "redis-18052.c1.us-east1-2.gce.cloud.redislabs.com",
    password: process.env.REDIS_PASSWORD
});

const DEFAULT_EXPIRATION = 3600;

app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3000;

const api = {
    key: process.env.REACT_APP_WEATHER_API_KEY,
    base: "https://api.openweathermap.org/data/2.5/weather"
};

app.get("/weather", async (req, res) => {
    const q = req.query.query;
    const redisData = await tedis.get(q);
    if (redisData){
        return res.json(JSON.parse(redisData))
    }else{
        const { data } = await axios.get(
            api.base,
            { params: { q, units: "metric", APPID: api.key} }
        ).catch(() => {return {data:{message: "city not found"}}});

        await tedis.setex(q, DEFAULT_EXPIRATION, JSON.stringify(data));

        res.json(data)
    }
});

app.listen(PORT);
