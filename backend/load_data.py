import pandas as pd
import sqlite3
import os

CSV_PATH = "../data/vehicles.csv"
DB_PATH = "cars.db"

print("Loading CSV...")
df = pd.read_csv(CSV_PATH, low_memory=False)
print(f"Raw rows: {len(df)}")

# Keep only useful columns
cols = ["manufacturer", "model", "year", "price", "odometer",
        "condition", "fuel", "transmission", "drive", "type",
        "paint_color", "state"]
df = df[cols]

# Clean
df = df.dropna(subset=["manufacturer", "model", "year", "price"])
df = df[df["price"] > 500]
df = df[df["price"] < 200000]
df = df[df["year"] >= 1990]
df = df[df["year"] <= 2025]
df = df[df["odometer"] > 0]
df = df[df["odometer"] < 500000]

# Normalize
df["manufacturer"] = df["manufacturer"].str.strip().str.title()
df["model"] = df["model"].str.strip().str.lower()
df["year"] = df["year"].astype(int)
df["price"] = df["price"].astype(int)
df["odometer"] = df["odometer"].astype(int)

df = df.reset_index(drop=True)
print(f"Clean rows: {len(df)}")

# Save to SQLite
conn = sqlite3.connect(DB_PATH)
df.to_sql("cars", conn, if_exists="replace", index=True, index_label="id")

# Index for fast queries
conn.execute("CREATE INDEX IF NOT EXISTS idx_manufacturer ON cars(manufacturer)")
conn.execute("CREATE INDEX IF NOT EXISTS idx_year ON cars(year)")
conn.execute("CREATE INDEX IF NOT EXISTS idx_price ON cars(price)")
conn.execute("CREATE INDEX IF NOT EXISTS idx_odometer ON cars(odometer)")
conn.commit()
conn.close()

print(f"Done! Database saved to {DB_PATH}")
