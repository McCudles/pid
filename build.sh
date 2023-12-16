rsync -uvrP --info=progress2 ./ pi@pi://home/pi/pid
ssh pi@pi "sudo systemctl restart pid-controller"
