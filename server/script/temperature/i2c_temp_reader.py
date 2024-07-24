import smbus
import time
import sqlite3
import subprocess
import re
import requests
import os
from dotenv import load_dotenv
import math

load_dotenv()

bus = smbus.SMBus(1)
TEMP_REG = 0x00
lm92_address = None
known_addresses = [0x48, 0x49, 0x4A, 0x4B] 

def find_i2c_address():
    result = subprocess.check_output(["i2cdetect", "-y", "1"])
    result = result.decode('utf-8').split('\n')
    addresses = re.findall(r'\b[0-9a-fA-F]{2}\b', '\n'.join(result))
    addresses = [int(address, 16) for address in addresses if address != 'UU']
    print("I2C Adress found :", addresses)
    return addresses

def get_user_token():
    url = os.getenv("API_URL") + "auth/login"
    payload = {
        "username": os.getenv("APP_USERNAME"),
        "password": os.getenv("APP_PASSWORD")
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.json().get("data")
    else:
        print("Failed to get user token")
        return None

def update_temperature(temp):
    try:
        token = get_user_token()
        if token:
            url = os.getenv("API_URL") + "data/1"
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            payload = {
                "value": temp
            }
            response = requests.put(url, json=payload, headers=headers)
            if response.status_code == 200:
                print("Temperature updated successfully", temp)
            else:
                print("Failed to update temperature")
        else:
            print("No token available, cannot update temperature")
    except requests.exceptions.RequestException as e:
        print(f"Error updating temperature: {e}")

def read_temperature():
    try:
        data = bus.read_i2c_block_data(lm92_address, TEMP_REG, 2)
        raw_temp = (data[0] << 8) | data[1]
    
        raw_temp = raw_temp >> 3
  
        if raw_temp & 0x1000: 
            raw_temp = raw_temp - 8192 
        temperature = math.ceil(raw_temp * 0.062)
    except Exception as e:
        print(f"No data available: {e}")
        temperature = "---"
    return temperature

while True:
    available_addresses = find_i2c_address()
    if lm92_address is None:
        for addr in available_addresses:
            if addr in known_addresses:
                lm92_address = addr
                break
        if lm92_address is None:
            print("Capteur LM92 non trouvé sur le bus I2C, réessayez dans 10 secondes...")
            update_temperature("---")
    else:
        temp = read_temperature()
        print(f"Temperature: {temp}°C")
        update_temperature(str(temp))
    
    time.sleep(3) 