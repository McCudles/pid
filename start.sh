echo "this is the start script"

git pull
cd web && bun install
bun start &
cd ..
