from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(__file__), "cars.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# ── /options ──────────────────────────────────────────────
@app.get("/options")
def get_options():
    conn = get_db()
    def distinct(col):
        rows = conn.execute(
            f"SELECT DISTINCT {col} FROM cars WHERE {col} IS NOT NULL ORDER BY {col}"
        ).fetchall()
        return [r[0] for r in rows if r[0]]

    options = {
        "manufacturers": distinct("manufacturer"),
        "fuels":         distinct("fuel"),
        "transmissions": distinct("transmission"),
        "conditions":    distinct("condition"),
        "drives":        distinct("drive"),
        "types":         distinct("type"),
        "colors":        distinct("paint_color"),
        "states":        distinct("state"),
        "year_min": conn.execute("SELECT MIN(year) FROM cars").fetchone()[0],
        "year_max": conn.execute("SELECT MAX(year) FROM cars").fetchone()[0],
        "price_min": conn.execute("SELECT MIN(price) FROM cars").fetchone()[0],
        "price_max": conn.execute("SELECT MAX(price) FROM cars").fetchone()[0],
        "odometer_max": conn.execute("SELECT MAX(odometer) FROM cars").fetchone()[0],
    }
    conn.close()
    return options


# ── /search ───────────────────────────────────────────────
@app.get("/search")
def search_cars(
    q: str = None,
    manufacturer: str = None,
    model: str = None,
    year_min: int = None,
    year_max: int = None,
    price_min: int = None,
    price_max: int = None,
    odometer_max: int = None,
    fuel: str = None,
    transmission: str = None,
    condition: str = None,
    drive: str = None,
    type: str = None,
    paint_color: str = None,
    state: str = None,
    limit: int = Query(default=24, le=100),
    offset: int = 0,
):
    query = "SELECT * FROM cars WHERE 1=1"
    params = []

    if q:
        for word in q.strip().split():
            query += " AND (LOWER(manufacturer) LIKE LOWER(?) OR LOWER(model) LIKE LOWER(?))"
            params.extend([f"%{word}%", f"%{word}%"])
    if manufacturer:
        query += " AND LOWER(manufacturer) = LOWER(?)"
        params.append(manufacturer)
    if model:
        query += " AND LOWER(model) LIKE LOWER(?)"
        params.append(f"%{model}%")
    if year_min:
        query += " AND year >= ?"
        params.append(year_min)
    if year_max:
        query += " AND year <= ?"
        params.append(year_max)
    if price_min:
        query += " AND price >= ?"
        params.append(price_min)
    if price_max:
        query += " AND price <= ?"
        params.append(price_max)
    if odometer_max:
        query += " AND odometer <= ?"
        params.append(odometer_max)
    if fuel:
        query += " AND LOWER(fuel) = LOWER(?)"
        params.append(fuel)
    if transmission:
        query += " AND LOWER(transmission) = LOWER(?)"
        params.append(transmission)
    if condition:
        query += " AND LOWER(condition) = LOWER(?)"
        params.append(condition)
    if drive:
        query += " AND LOWER(drive) = LOWER(?)"
        params.append(drive)
    if type:
        query += " AND LOWER(type) = LOWER(?)"
        params.append(type)
    if paint_color:
        query += " AND LOWER(paint_color) = LOWER(?)"
        params.append(paint_color)
    if state:
        query += " AND LOWER(state) = LOWER(?)"
        params.append(state)

    count_query = query.replace("SELECT *", "SELECT COUNT(*)")
    conn = get_db()
    total = conn.execute(count_query, params).fetchone()[0]

    query += " ORDER BY year DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    rows = conn.execute(query, params).fetchall()
    conn.close()

    return {
        "total": total,
        "offset": offset,
        "limit": limit,
        "results": [dict(r) for r in rows],
    }


# ── /chat ─────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

SYSTEM_PROMPT = """You are a car search assistant. Convert the user's message into a JSON filter object.

Only return a valid JSON object with these optional fields:
{
  "manufacturer": string,
  "model": string,
  "year_min": int,
  "year_max": int,
  "price_min": int,
  "price_max": int,
  "odometer_max": int,
  "fuel": string,         // gas, diesel, electric, hybrid, other
  "transmission": string, // automatic, manual, other
  "condition": string,    // new, like new, excellent, good, fair, salvage
  "drive": string,        // 4wd, fwd, rwd
  "type": string,         // sedan, suv, pickup, truck, coupe, van, wagon, convertible, hatchback, mini-van, bus, offroad, other
  "paint_color": string,
  "state": string         // 2-letter US state code
}

Only include fields that the user mentioned. Return ONLY the JSON, no explanation."""

@app.post("/chat")
def chat(req: ChatRequest):
    if not OPENAI_API_KEY:
        return {"error": "OPENAI_API_KEY not set", "filters": {}}

    client = OpenAI(api_key=OPENAI_API_KEY)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": req.message},
        ],
        temperature=0,
    )
    text = response.choices[0].message.content.strip().replace("```json", "").replace("```", "").strip()

    try:
        filters = json.loads(text)
    except json.JSONDecodeError:
        filters = {}

    return {"filters": filters, "message": req.message}


# ── /car/{id} ─────────────────────────────────────────────
from fastapi import HTTPException

@app.get("/car/{car_id}")
def get_car(car_id: int):
    conn = get_db()
    row = conn.execute("SELECT * FROM cars WHERE id = ?", [car_id]).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Car not found")
    return dict(row)


# ── /listing/{id} — AI generated listing ─────────────────
@app.get("/listing/{car_id}")
def get_listing(car_id: int):
    conn = get_db()
    row = conn.execute("SELECT * FROM cars WHERE id = ?", [car_id]).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Car not found")

    car = dict(row)
    client = OpenAI(api_key=OPENAI_API_KEY)

    prompt = f"""You are a professional car listing copywriter. Write a compelling listing for this vehicle.

{car['year']} {car['manufacturer']} {car['model'].title()}
Price: ${car['price']:,}
Mileage: {car.get('odometer', 0):,} miles
Fuel: {car.get('fuel', 'N/A')} | Transmission: {car.get('transmission', 'N/A')} | Drive: {car.get('drive', 'N/A')}
Condition: {car.get('condition', 'N/A')} | Type: {car.get('type', 'N/A')} | Color: {car.get('paint_color', 'N/A')}
Location: {str(car.get('state', '')).upper()}

Return ONLY a JSON object:
{{
  "tagline": "short punchy headline under 10 words",
  "description": "2 engaging paragraphs about this specific vehicle",
  "highlights": ["5 specific selling points as short phrases"],
  "ideal_for": "one sentence about who this car suits best",
  "seller_note": "short friendly note from the seller"
}}"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.8,
    )
    text = response.choices[0].message.content.strip().replace("```json", "").replace("```", "").strip()

    try:
        listing = json.loads(text)
    except json.JSONDecodeError:
        listing = {
            "tagline": f"{car['year']} {car['manufacturer']} — Great Deal",
            "description": "A well-maintained vehicle ready for its next owner.",
            "highlights": [],
            "ideal_for": "Various buyers.",
            "seller_note": "Contact us for more info.",
        }

    return {"car": car, "listing": listing}
