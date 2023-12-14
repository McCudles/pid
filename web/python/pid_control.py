import csv
import glob
import os
import sys
import time

import RPi.GPIO as GPIO
from simple_pid import PID

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
        temp_c = float(temp_string) / 1000.0
        return temp_c


pwm_pin = 19
GPIO.setmode(GPIO.BCM)
GPIO.setup(pwm_pin, GPIO.OUT)
pwm = GPIO.PWM(pwm_pin, 100)  # 100 Hz frequency
# Kp = float(input("Kp:"))
Kp = float(sys.argv[1])
# Ki = float(input("Ki:"))
Ki = float(sys.argv[2])
# Kd = float(input("Kd:"))
Kd = float(sys.argv[3])
Tsp = 60
pid = PID(Kp, Ki, Kd, setpoint=Tsp)
pid.output_limits = (0, 50)
csv_file = f"csv/pid_Kp{Kp}_Ki{Ki}_Kd{Kd}.csv"
temp_file = f"csv/temp.csv"
data = [["Time", "Input", "Temperature", "Set Point"], [0, 0, read_temp(), Tsp]]
print("Time", "Input", "Temperature", "Set Point")
print(0, 0, read_temp(), 0)
try:
    pwm.start(0)
    tcurrent = time.time()
    tstart = tcurrent
    while True:
        if time.time() - tcurrent > 3:
            tcurrent = time.time()
            T = read_temp()
            power_level = pid(T)
            pwm.ChangeDutyCycle(power_level)
            t = int(tcurrent - tstart)
            additional_data = [[t, power_level, T, Tsp]]
            data += additional_data
            print(t, power_level, T, Tsp)
            with open(csv_file, mode="w", newline="", encoding="utf-8-sig") as file:
                writer = csv.writer(file, quoting=csv.QUOTE_NONE)
                writer.writerows(data)
            with open(temp_file, mode="w", newline="", encoding="utf-8-sig") as file:
                writer = csv.writer(file, quoting=csv.QUOTE_NONE)
                writer.writerows(data)

except KeyboardInterrupt:
    with open(csv_file, mode="w", newline="", encoding="utf-8-sig") as file:
        writer = csv.writer(file, quoting=csv.QUOTE_NONE)
        writer.writerows(data)
    print(f'CSV file "{csv_file}" created successfully.')
    pass

finally:
    pwm.stop()
    GPIO.cleanup()
