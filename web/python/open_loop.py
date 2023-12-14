import csv
import os
import glob
import time
import RPi.GPIO as GPIO

os.system("modprobe w1-gpio")
os.system("modprobe w1-therm")

base_dir = "/sys/bus/w1/devices/"
device_folder = glob.glob(base_dir + "28*")[0]
device_file = device_folder + "/w1_slave"


def read_temp_raw():
    f = open(device_file, "r")
    lines = f.readlines()
    f.close()
    return lines


def read_temp():
    lines = read_temp_raw()
    while lines[0].strip()[-3:] != "YES":
        lines = read_temp_raw()
    equals_pos = lines[1].find("t=")
    if equals_pos != -1:
        temp_string = lines[1][equals_pos + 2 :]
        temp_c = float(temp_string) / 1000.00
        return temp_c


# Define GPIO pin
pwm_pin = 19


# Set the GPIO mode and pin
GPIO.setmode(GPIO.BCM)
GPIO.setup(pwm_pin, GPIO.OUT)

# Create PWM instance
pwm = GPIO.PWM(pwm_pin, 100)  # 100 Hz frequency, adjust as needed

pwm.start(0)
power_level = float(input("Enter power level for open loop (0-100): "))
pwm.ChangeDutyCycle(power_level)
csv_file = f"open_loop_{power_level}.csv"
t0 = time.time()
data = [["Temperature", "Time"], [read_temp(), 0]]  # Header
print("Temperature", "time")
print(read_temp(), 0)
try:
    while True:
        time.sleep(0.5)
        ti = time.time() - t0
        additional_data = [[read_temp(), ti]]
        data += additional_data
        print(read_temp(), ti)


except KeyboardInterrupt:
    with open(csv_file, mode="w", newline="", encoding="utf-8-sig") as file:
        writer = csv.writer(file, quoting=csv.QUOTE_NONE)
        writer.writerows(data)
    print(f'CSV file "{csv_file}" created successfully.')
    pass

finally:
    # Clean up
    pwm.stop()
    GPIO.cleanup()
