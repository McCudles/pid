import RPi.GPIO as GPIO

# Define GPIO pin
pwm_pin = 19

# Set the GPIO mode and pin
GPIO.setmode(GPIO.BCM)
GPIO.setup(pwm_pin, GPIO.OUT)

# Create PWM instance
pwm = GPIO.PWM(pwm_pin, 100)  # 100 Hz frequency, adjust as needed

try:
    # Start PWM with 0% duty cycle
    pwm.start(0)

    # Main loop
    while True:
        # Adjust duty cycle for desired power level (0 to 100)
        power_level = float(input("Enter power level (0-100): "))
        pwm.ChangeDutyCycle(power_level)

except KeyboardInterrupt:
    pass

finally:
    # Clean up
    pwm.stop()
    GPIO.cleanup()
