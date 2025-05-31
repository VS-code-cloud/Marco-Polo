// === Location Logic ===

function getUserLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(success, error);
}

function success(position) {
  const userLat = position.coords.latitude;
  const userLon = position.coords.longitude;
  console.log("User location:", userLat, userLon);
  matchCity(userLat, userLon);
}

function error() {
  alert("Unable to retrieve your location. Please enable location services.");
}

function matchCity(userLat, userLon) {
  fetch("data/locations.json")
    .then(res => res.json())
    .then(locations => {
      let closestCity = null;
      let closestDist = Infinity;

      locations.forEach(loc => {
        const d = distance(userLat, userLon, loc.lat, loc.lon);
        if (d < closestDist) {
          closestDist = d;
          closestCity = loc.city;
        }
      });

      if (closestCity) {
        localStorage.setItem("currentLocation", closestCity);
        alert(`You are near: ${closestCity}`);
        window.location.href = "quests.html";
      } else {
        alert("No known city found nearby.");
      }
    });
}

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// === Quest Display Logic (on quests.html) ===

if (window.location.pathname.includes("quests.html")) {
  const city = localStorage.getItem("currentLocation");
  document.getElementById("cityName").innerText = "City: " + city;

  fetch("data/quests.json")
    .then(res => res.json())
    .then(data => {
      const quests = data[city];
      const container = document.getElementById("questContainer");

      if (!quests) {
        container.innerText = "No quests found for this city.";
        return;
      }

      quests.forEach((quest, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <p>${quest}</p>
          <button onclick="completeQuest(${index})">Complete</button>
        `;
        container.appendChild(div);
      });
    });

  function completeQuest(index) {
    let xp = parseInt(localStorage.getItem("xp") || "0");
    const prevLevel = Math.floor(xp / 200);
    xp += 50;
    localStorage.setItem("xp", xp);
    updateXPBar();
    const newLevel = Math.floor(xp / 200);
    if (newLevel > prevLevel) {
      alert(`🎉 Level up! You are now level ${newLevel}!`);
    } else {
      alert(`+50 XP! Total XP: ${xp}`);
    }
  }

  function updateXPBar() {
    const xp = parseInt(localStorage.getItem("xp") || "0");
    const level = Math.floor(xp / 200);
    const progress = xp % 200;
    const bar = document.getElementById("xpBar");
    const levelDisplay = document.getElementById("level");

    if (bar) bar.style.width = `${(progress / 200) * 100}%`;
    if (levelDisplay) levelDisplay.innerText = level;
  }

  window.onload = updateXPBar;

  function resetXP() {
  localStorage.setItem("xp", 0);
  updateXPBar();
  alert("XP reset!");
}

}
