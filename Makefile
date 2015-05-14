install:
	if hash node > /dev/null 2>&1; then echo "Seems like node.js is alread installed."; exit 1;  fi
	wget "https://iojs.org/dist/v2.0.1/iojs-v2.0.1-linux-armv6l.tar.gz" -O node.tar.gz && tar xvzf node.tar.gz && rm node.tar.gz
	sudo mkdir /opt/node
	sudo mv iojs*/* /opt/node
	sudo ln -s /opt/node/bin/n* /usr/bin
	sudo ln -s /opt/node/bin/iojs /usr/bin/
	rm -rf iojs*
	rm -rf node*
	node --version
	npm --version

clean:
	sudo unlink /usr/bin/node
	sudo unlink /usr/bin/npm
	sudo rm -rf /opt/node

test:
		#@NODE_ENV=test ./node_modules/mocha/bin/mocha
		@NODE_ENV=test node ./node_modules/istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha -- -d --recursive -R spec
		#node ./node_modules/istanbul/lib/cli.js check-coverage --statements 100 --functions 100 --branches 100 --lines 100

.PHONY: test
