echo "this is the start script"

cd web && bun install
bun start &
cd ..
