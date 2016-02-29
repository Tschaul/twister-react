# twister-react
A drop-in-replacement for [twister-html](https://github.com/miguelfreitas/twister-html) written in [React](https://facebook.github.io/react/) using [Bootstrap](http://getbootstrap.com/) with the [paper theme](https://bootswatch.com/paper/).

The main purpose of this project is to test the underlying Twister library [twister-lib-js](https://github.com/tschaul/twister-lib-js).


## Missing Features			

* User Search
* Trending Hashtags
* Direct Messages

## Setup as hosted by a public twister proxy

First we install basic dependecies

```
apt-get update
apt-get install -y git curl nodejs nodejs-legacy npm
curl -sSL https://get.docker.com/ | sh
```

Now we pull twister-core

```
git clone https://github.com/miguelfreitas/twister-core.git

mkdir ~/.twister
echo -e "rpcuser=user\nrpcpassword=pwd\nhtmldir=~/twister-react" > ~/.twister/twister.conf
chmod 600 ~/.twister/twister.conf
```

Next are this repo and twister-proxy

```
git clone https://github.com/Tschaul/twister-react.git
git clone https://github.com/digital-dreamer/twister-proxy.git

npm install -g forever
```

We setup twister-proxy and pull the settings from this repo

```
cd twister-proxy
npm install
curl https://raw.githubusercontent.com/Tschaul/twister-react/master/docker/settings.json > settings.json
cd ..
```

Next we need the start script from this repo and set the correct rights.

```
curl https://raw.githubusercontent.com/Tschaul/twister-react/master/docker/run.sh > run.sh
chmod 777 run.sh 
```

For https to work we need certificates.

```
git clone https://github.com/letsencrypt/letsencrypt

./letsencrypt/letsencrypt-auto certonly --standalone
```

letsencrypt will ask you to provide an email address and your domain. It will then save your certificates in /etc/letsencrypt/live/example.com/ where example.com is your domain.

As last step we have to tell twister-proxy where the certificates are

```
nano twister-proxy/settings.json 
```

Inside "Server" replace example.com by your domain in a the "ssl_*" properties. Press Crtl+O to save and then Crtl+X to exit.

Now we can start it up. When starting for the first time it will pull the twister docker-image.

```
./run.sh
```

twisterd now needs a while (10min to 1h depending on your connection) to download the blockchain. You can check `top` to see if twisterd is still busy.

## Screenshots

![Alt text](/screenshots/home.png?raw=true "Home")

The home screen with two click account switching.

![Alt text](/screenshots/post.png?raw=true "New Post Modal")

The new post modal

![Alt text](/screenshots/profile.png?raw=true "Profile")

The profile page on the posts tab

![Alt text](/screenshots/following.png?raw=true "Following")

The profile page on the following tab

![Alt text](/screenshots/mentions.png?raw=true "Mentions")

The profile page on the mentions tab

![Alt text](/screenshots/conversation.png?raw=true "Conversation")

The conversation page
