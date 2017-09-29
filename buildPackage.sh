# To better unit test jenkins build we externalize the build process in a shell
# then call the shell from jenkins on the build server
echo "Build..."
#rc=$(npm run build 2>&1)
if [[ $rc == *"ERROR"* ]]; then
  echo "Build failed ..."
  echo $rc
  exit
fi

echo "Unit test..."
rc=$(npm test 2>&1)
if [[ $rc == *"fail"*  || $rc == *"Error"* ]]; then
  echo "Tests failed"
  echo $rc
  exit
fi
echo "Dockerize...."
# docker build -t case/wcsbroker .
# docker tag case/wcsbroker mycluster.cfc:8500/default/casewcsbroker:v0.0.1
# cd helm; helm package casewcsbroker
