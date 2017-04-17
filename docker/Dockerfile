# 
# Dockerfile for building Twister peer-to-peer micro-blogging 
# 

FROM ubuntu:14.04

WORKDIR /opt
USER root

RUN apt-get update
RUN apt-get install -y git autoconf libtool build-essential libboost-all-dev libssl-dev libdb++-dev libminiupnpc-dev \
    supervisor nodejs nodejs-legacy npm && \
    apt-get clean

RUN git clone https://github.com/miguelfreitas/twister-core.git
RUN cd twister-core && \
    ./bootstrap.sh && \
    make

RUN git clone https://github.com/Tschaul/twister-react.git
RUN git clone https://github.com/Tschaul/twister-lib-js.git
RUN git clone https://github.com/digital-dreamer/twister-proxy.git

RUN npm install -g browserify react-tools

RUN cd twister-lib-js \ npm install

RUN cd twister-proxy && npm install

RUN mv twister-react/index.html twister-react/home.html

COPY settings.json twister-proxy/

RUN mkdir -p /root/.twister
COPY twister.conf /root/.twister/twister.conf
RUN chmod 600 /root/.twister/twister.conf

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

VOLUME ["/root/.twister"]

CMD ["/usr/bin/supervisord"]
ENTRYPOINT []

EXPOSE 80