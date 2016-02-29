# twister-react
A drop-in-replacement for [twister-html](https://github.com/miguelfreitas/twister-html) written in [React](https://facebook.github.io/react/) using [Bootstrap](http://getbootstrap.com/) with the [paper theme](https://bootswatch.com/paper/).

The main purpose of this project is to test the underlying Twister library [twister-lib-js](https://github.com/tschaul/twister-lib-js).


## Missing Features			

* User Search
* Trending Hashtags
* Direct Messages

## Setup as hosted by a publix twister proxy

apt-get update
apt-get install -y git curl nodejs nodejs-legacy npm
curl -sSL https://get.docker.com/ | sh
git clone https://github.com/miguelfreitas/twister-core.git

mkdir ~/.twister
echo -e "rpcuser=user\nrpcpassword=pwd\nhtmldir=~/twister-react" > ~/.twister/twister.conf
chmod 600 ~/.twister/twister.conf

git clone https://github.com/Tschaul/twister-react.git
git clone https://github.com/digital-dreamer/twister-proxy.git

npm install -g browserify react-tools forever

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
