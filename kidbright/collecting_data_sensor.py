from machine import Pin, ADC
import uasyncio as asyncio
import json
import network
import time
from umqtt.robust import MQTTClient
from config import (
    WIFI_SSID, WIFI_PASS,
    MQTT_BROKER, MQTT_USER, MQTT_PASS
)
from machine import Pin, I2C, ADC
import time
import math

i2c = I2C(1, sda=Pin(4), scl=Pin(5))

light_adc = ADC(Pin(36))


lamp = Pin(25,Pin.OUT)
lamp.value(1)

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_PASS)
print("Connecting To WIFI.......")
while not wlan.isconnected():
    time.sleep(0.5)
print("Wifi Connected!!")



mqtt = MQTTClient(client_id="",
                  server=MQTT_BROKER,
                  user=MQTT_USER,
                  password=MQTT_PASS)
print("============================")
print("Connecting to MQTT broker...")
mqtt.connect()
print("MQTT broker connected")


VOLTAGE_REFERENCE = {
    0: 1.1,
    2.5: 1.5,
    6: 2.2,
    11: 3.9
}




        
def read_temperature():

    i2c.writeto(77, bytearray([0]))
    time.sleep(0.1) 
    
    data = i2c.readfrom(77, 2)
    
    H = data[0]
    L = data[1]
    
    value = (H * 256) + L
    
    
    temp_value = value / 128
    
    
    temp_value = round(temp_value, 4)
    
    return temp_value



def read_lux():
    light_value = light_adc.read()
    attenuation_voltage = VOLTAGE_REFERENCE.get(0, 1.1)  
    voltage_a = light_value / 4095 * attenuation_voltage
    resistance_ldr = voltage_a * 33000 / (3.3 - voltage_a) * 0.001  
    log_lux = -((math.log10(resistance_ldr) - 2.163) / 0.790)
    lux = pow(10, log_lux)
    return lux

    
async def mqtt_check():
    while True:
        mqtt.check_msg()
        await asyncio.sleep_ms(0)
        
    
async def publish_data():
    while True:
        light_value = read_lux()
        temp_value = read_temperature()
        
        sensor_data = {
            "lux": light_value,
            "temperature": temp_value,
            "lat": 14.029640844070505,
            "lon": 100.66010257796931,
        }

        json_data = json.dumps(sensor_data)
        print(f"Publishing: {json_data}")
        mqtt.publish("b6610545243/sensors", json_data)

        # Wait 10 minutes (600 seconds) but keep connection alive
        for _ in range(10):  # 10 iterations of 60 seconds each
            await asyncio.sleep(60)  # Sleep for 60 seconds
            mqtt.ping()  # Send a keep-alive ping to prevent disconnection

        
        
async def main():
    asyncio.create_task(mqtt_check())  
    asyncio.create_task(publish_data())  

    while True:
        await asyncio.sleep(1)
        



asyncio.run(main())

    
    
    






