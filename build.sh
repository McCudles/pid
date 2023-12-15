rsync -uvrP --info=progress2 ./ pi@pi://home/pi/pid
ssh pi@pi "systemctl restart pid-controller"
