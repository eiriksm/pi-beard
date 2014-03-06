install:
	if hash node > /dev/null 2>&1; then echo "Seems like node.js is alread installed."; exit 1;  fi
	wget "http://nodejs.org/dist/v0.10.24/node-v0.10.24-linux-arm-pi.tar.gz" -O node.tar.gz && tar xvzf node.tar.gz && rm node.tar.gz
	sudo mkdir /opt/node
	sudo mv node*/* /opt/node
	sudo ln -s /opt/node/bin/n* /usr/bin
	rm -rf node*
	node --version
	npm --version

clean:
	sudo unlink /usr/bin/node
	sudo unlink /usr/bin/npm
	sudo rm -rf /opt/node
