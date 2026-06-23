import { Request, Response } from "express";
import axios from "axios";

// weatherController.ts
export const getWeatherData = async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string || "Colombo";
    const apiKey = "ae8b3749e31337be707f2e1a5fb16931";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(url);
    const data: any = response.data;

    res.status(200).json({
      temp: Math.round(data.list[0].main.temp),
      description: data.list[0].weather[0].description,
      humidity: data.list[0].main.humidity,
      wind: data.list[0].wind.speed,
      rain: data.list[0].clouds.all,
      forecast: data.list.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
};