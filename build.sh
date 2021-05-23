yarn build
yarn sse build

if [ ${ENV} = "development" ]; then
  echo "DEV MODE"
else
  yarn web build
fi