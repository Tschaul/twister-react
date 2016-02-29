cd twister-core
docker run -d -p 28332:28332 -v /root/.twister:/root/.twister -v /root/twister-react:/root/twister-react miguelfreitas/twister -htmldir=/root/twister-react -rpcthreads=100
cd ..

cd twister-proxy
forever start twister-proxy.js &
cd ..
