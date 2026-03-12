import json
import random

def gen():
    flights = []
    # major hubs for diversity
    hubs = [
        (40.7128, -74.0060), (51.5074, -0.1278), (35.6895, 139.6917),
        (25.2048, 55.2708), (1.3521, 103.8198), (48.8566, 2.3522),
        (34.0522, -118.2437), (28.6139, 77.2090), (-33.8688, 151.2093),
        (-23.5505, -46.6333),
    ]

    n = 1
    for hub in hubs:
        for _ in range(50):
            lat = hub[0] + random.uniform(-15.0, 15.0)
            lng = hub[1] + random.uniform(-15.0, 15.0)
            hdg = random.uniform(0, 360)
            vel = random.uniform(200, 260)
            alt = random.uniform(8000, 12000)

            icao = f"{n:06x}"
            cs = f"FLT{random.randint(100, 9999)}"

            # opensky state vector layout
            flight = [
                icao, cs + "  ", "United States", 0, 0,
                lng, lat, alt, False, vel, hdg,
                0, None, None, None, False, 0,
            ]
            flights.append(flight)
            n += 1

    out = "c:/Users/Smruti/.gemini/antigravity/scratch/GOD VIEW/backend/app/api/fallback_flights.json"
    with open(out, "w") as f:
        json.dump({"states": flights}, f)

if __name__ == "__main__":
    gen()
    print("fallback flights generated")
