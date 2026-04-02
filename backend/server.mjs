import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs  from "fs";
import connetDB from "./config/db.mjs";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Create the app
const app = express();
app.use(bodyParser.json());
app.use(cors());
connetDB()








// Load the GeoJSON data
let stations = [];
const graph = {};

fs.readFile("./metro-lines-stations.geojson", "utf8", (err, data) => {
  if (err) {
    console.error("Error loading GeoJSON file:", err);
    return;
  }

  const geojson = JSON.parse(data);

  // Extract station names and create graph
  geojson.features.forEach(feature => {
    const { Name: Name } = feature.properties;

    // Initialize graph node
    stations.push(Name);
    graph[Name] = {};
  });



  console.log("Stations and connections loaded.");
});
console.log("Generated Graph:", JSON.stringify(graph, null, 2));

// API to get the list of stations
app.get("/stations", (req, res) => {
  res.json(stations);
});
// Dijkstra's algorithm to find the shortest path
function findShortestPath(graph, start, end) {
  const distances = {};
  const previous = {};
  const queue = new Set(Object.keys(graph));

  Object.keys(graph).forEach(station => {
    distances[station] = station === start ? 0 : Infinity;
    previous[station] = null;
  });

  while (queue.size) {
    const currentStation = Array.from(queue).reduce((minStation, station) =>
      distances[station] < distances[minStation] ? station : minStation
    );

    queue.delete(currentStation);

    if (currentStation === end) break;

    for (const [neighbor, distance] of Object.entries(graph[currentStation] || {})) {
      const alt = distances[currentStation] + distance;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = currentStation;
      }
    }
  }
  if (Object.keys(graph).length === 0) {
    console.error("Error: Graph is empty. Check GeoJSON processing.");
  }
  
  const path = [];
  for (let at = end; at; at = previous[at]) {
    path.unshift(at);
  }

  return path.length && path[0] === start ? path : null;
}

// API to calculate the route
app.post("/route", (req, res) => {
  const { source, destination } = req.body;

  if (!stations.includes(source) || !stations.includes(destination)) {
    return res.status(400).json({ message: "Invalid source or destination." });
  }

  const route = findShortestPath(graph, source, destination);
  if (route) {
    res.json({ route });
  } else {
    res.status(400).json({ message: "No route found." });
  }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



