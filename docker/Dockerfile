# 
# Dockerfile for building Twister peer-to-peer micro-blogging 
# 

FROM ubuntu:14.04 

# Install twister-core 

RUN apt-get update
RUN apt-get install -y git autoconf libtool build-essential libboost-all-dev libssl-dev libdb++-dev libminiupnpc-dev && apt-get clean
RUN git clone https://github.com/miguelfreitas/twister-core.git
RUN cd twister-core && \
    ./bootstrap.sh && \
    make

RUN mkdir ~/.twister
RUN echo -e "rpcuser=user\nrpcpassword=pwd\nhtmldir=~/twister-react" > ~/.twister/twister.conf
RUN chmod 600 ~/.twister/twister.conf

RUN git clone https://github.com/Tschaul/twister-react.git
RUN git clone https://github.com/Tschaul/twister-lib-js.git
RUN git clone https://github.com/digital-dreamer/twister-proxy.git

RUN apt-get install -y nodejs nodejs-legacy npm

RUN npm install -g browserify react-tools

RUN cd twister-lib-js \ npm install

RUN cd twister-react \ npm install \ npm run pull-lib-and-build

RUN cd twister-proxy \ npm install

COPY settings.json twister-proxy/

CMD cd twister-core \ ./twisterd & \ cd ../twister-proxy \ node twister-proxy.js &
