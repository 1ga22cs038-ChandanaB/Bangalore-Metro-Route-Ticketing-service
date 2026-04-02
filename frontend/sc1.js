// Function to load the GeoJSON file
async function loadStations() {
  const response = await fetch('metro-lines-stations.geojson'); // Replace with the actual path
  const data = await response.json();
  const metroStations = parseGeoJSON(data);
  return metroStations;
}

function parseGeoJSON(data) {
  const stations = {};
  const lines = [];

  // Parse station points
  data.features.forEach((feature) => {
    if (feature.geometry.type === "Point" && feature.properties.Name) {
      stations[feature.properties.Name] = {}; // Initialize the station graph
    } else if (feature.geometry.type === "LineString" && feature.properties.Name) {
      // Capture line connections for later processing
      lines.push({
        lineName: feature.properties.Name,
        coordinates: feature.geometry.coordinates,
      });
    }
  });

  // Build connections based on line data
  lines.forEach((line) => {
    const coordinates = line.coordinates;

    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = coordinates[i];
      const end = coordinates[i + 1];

      const startStation = findStationByCoordinates(stations, start);
      const endStation = findStationByCoordinates(stations, end);

      if (startStation && endStation) {
        const distance = calculateDistance(start, end);

        // Add bidirectional connections
        stations[startStation][endStation] = distance;
        stations[endStation][startStation] = distance;
      }
    }
    async function calculate() {
      // Load the GeoJSON file and parse the stations
      const response = await fetch('path-to-your-geojson-file.geojson'); // Replace with the actual path
      const data = await response.json();
      const metroStations = parseGeoJSON(data);
    
      // Get source and destination from the dropdowns
      const sourceStation = document.getElementById('source').value;
      const destinationStation = document.getElementById('destination').value;
    
      if (sourceStation === '' || destinationStation === '') {
        alert('Please select source and destination stations.');
        return;
      }
    
      // Dijkstra's algorithm implementation
      const stations = Object.keys(metroStations);
      const INF = Number.MAX_SAFE_INTEGER;
    
      const distances = {};
      const visited = {};
      const path = {};
    
      stations.forEach((station) => (distances[station] = INF));
      distances[sourceStation] = 0;
    
      while (true) {
        let currentStation = null;
    
        // Find the nearest unvisited station
        stations.forEach((station) => {
          if (
            !visited[station] &&
            (currentStation === null || distances[station] < distances[currentStation])
          ) {
            currentStation = station;
          }
        });
    
        if (currentStation === null || distances[currentStation] === INF) {
          break;
        }
    
        visited[currentStation] = true;
    
        // Update distances for neighbors
        for (const neighbor in metroStations[currentStation]) {
          const distance =
            distances[currentStation] + metroStations[currentStation][neighbor];
          if (distance < distances[neighbor]) {
            distances[neighbor] = distance;
            path[neighbor] = currentStation;
          }
        }
      }
    
      // Build the route and calculate the fare
      const route = [];
      let current = destinationStation;
      while (current !== sourceStation) {
        if (!path[current]) {
          alert('No route found.');
          return;
        }
        route.unshift(current);
        current = path[current];
      }
      route.unshift(sourceStation);
    
      const fare = distances[destinationStation];
    
      // Display the results
      document.getElementById('route').textContent = route.join(' -> ');
      document.getElementById('fare').textContent = fare + ' units';
    }
  });

  return stations;
}

// Helper function to calculate distance between two coordinates
function calculateDistance(coord1, coord2) {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 1000); // Convert to meters
}

// Helper function to find the station name by coordinates
function findStationByCoordinates(stations, coordinates) {
  const tolerance = 0.0001; // Tolerance for floating-point precision
  for (const [stationName, _] of Object.entries(stations)) {
    const [lon, lat] = stations[stationName].coordinates || [];
    if (
      Math.abs(lon - coordinates[0]) < tolerance &&
      Math.abs(lat - coordinates[1]) < tolerance
    ) {
      return stationName;
    }
  }
   return null;
}

async function calculate() {
  async function calculate() {
    console.log('Calculate button clicked!'); // Debug log
  
    const sourceStation = document.getElementById('source').value;
    const destinationStation = document.getElementById('destination').value;
  
    if (!sourceStation || !destinationStation) {
      alert('Please select source and destination stations.');
      console.log('Source or destination not selected.');
      return;
    }
  
    console.log(`Source: ${sourceStation}, Destination: ${destinationStation}`);
    // Further calculations and logic...
  }
  // Load the GeoJSON file and parse the stations
  const response = await fetch('path-to-your-geojson-file.geojson'); // Replace with the actual path
  const data = await response.json();
  const metroStations = parseGeoJSON(data);

  // Get source and destination from the dropdowns
  const sourceStation = document.getElementById('source').value;
  const destinationStation = document.getElementById('destination').value;

  if (sourceStation === '' || destinationStation === '') {
    alert('Please select source and destination stations.');
    return;
  }

  // Dijkstra's algorithm implementation
  const stations = Object.keys(metroStations);
  const INF = Number.MAX_SAFE_INTEGER;

  const distances = {};
  const visited = {};
  const path = {};

  stations.forEach((station) => (distances[station] = INF));
  distances[sourceStation] = 0;

  while (true) {
    let currentStation = null;

    // Find the nearest unvisited station
    stations.forEach((station) => {
      if (
        !visited[station] &&
        (currentStation === null || distances[station] < distances[currentStation])
      ) {
        currentStation = station;
      }
    });

    if (currentStation === null || distances[currentStation] === INF) {
      break;
    }

    visited[currentStation] = true;

    // Update distances for neighbors
    for (const neighbor in metroStations[currentStation]) {
      const distance =
        distances[currentStation] + metroStations[currentStation][neighbor];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        path[neighbor] = currentStation;
      }
    }
  }

  // Build the route and calculate the fare
  const route = [];
  let current = destinationStation;
  while (current !== sourceStation) {
    if (!path[current]) {
      alert('No route found.');
      return;
    }
    route.unshift(current);
    current = path[current];
  }
  route.unshift(sourceStation);

  const fare = distances[destinationStation];

  // Display the results
  document.getElementById('route').textContent = route.join(' -> ');
  document.getElementById('fare').textContent = fare +'units';

  async function calculate() {
    // Load the GeoJSON file and parse the stations
    const response = await fetch('path-to-your-geojson-file.geojson'); // Replace with the actual path
    const data = await response.json();
    const metroStations = parseGeoJSON(data);
  
    // Get source and destination from the dropdowns
    const sourceStation = document.getElementById('source').value;
    const destinationStation = document.getElementById('destination').value;
  
    if (sourceStation === '' || destinationStation === '') {
      alert('Please select source and destination stations.');
      return;
    }
  
    // Dijkstra's algorithm implementation
    const stations = Object.keys(metroStations);
    const INF = Number.MAX_SAFE_INTEGER;
  
    const distances = {};
    const visited = {};
    const path = {};
  
    stations.forEach((station) => (distances[station] = INF));
    distances[sourceStation] = 0;
  
    while (true) {
      let currentStation = null;
  
      // Find the nearest unvisited station
      stations.forEach((station) => {
        if (
          !visited[station] &&
          (currentStation === null || distances[station] < distances[currentStation])
        ) {
          currentStation = station;
        }
      });
  
      if (currentStation === null || distances[currentStation] === INF) {
        break;
      }
  
      visited[currentStation] = true;
  
      // Update distances for neighbors
      for (const neighbor in metroStations[currentStation]) {
        const distance =
          distances[currentStation] + metroStations[currentStation][neighbor];
        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          path[neighbor] = currentStation;
        }
      }
    }
  
    // Build the route and calculate the fare
    const route = [];
    let current = destinationStation;
    while (current !== sourceStation) {
      if (!path[current]) {
        alert('No route found.');
        return;
      }
      route.unshift(current);
      current = path[current];
    }
    route.unshift(sourceStation);
  
    const fare = distances[destinationStation];
  
    // Display the results
    document.getElementById('route').textContent = route.join(' -> ');
    document.getElementById('fare').textContent = fare + ' units';
  }
}

// Call this function on page load to populate stations dropdown
async function populateDropdowns() {
  const metroStations = await loadStations();
  const stationNames = Object.keys(metroStations);

  const sourceDropdown = document.getElementById('source');
  const destinationDropdown = document.getElementById('destination');

  stationNames.forEach((station) => {
    const option1 = document.createElement('option');
    option1.value = station;
    option1.textContent = station;
    sourceDropdown.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = station;
    option2.textContent = station;
    destinationDropdown.appendChild(option2);
  });
}

// Initialize the dropdowns on page load
populateDropdowns();