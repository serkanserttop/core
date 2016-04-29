FROM cloud9/workspace
MAINTAINER Serkan Serttop <serkanserttop@smartface.io>

RUN echo "Version 0.1"

#check if Java 1.7 is installed, if not, then install
RUN if [ $(dpkg-query -W -f='${Status}' openjdk-7-jdk 2>/dev/null | grep -c "ok installed") -eq 0 ]; \
	then \
		sudo apt-get install -y openjdk-7-jdk; \
	fi; \
	sudo sh -c "echo 'JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64\nPATH=\$PATH:/usr/local/bin:$JAVA_HOME/bin\nexport JAVA_HOME\nexport JRE_HOME\nexport PATH' >> /etc/profile" && \
	sudo apt-get update && \
	sudo apt-get install -y lib32z1 lib32ncurses5 lib32bz2-1.0 lib32stdc++6 && \
	curl -OL https://raw.githubusercontent.com/iBotPeaches/Apktool/master/scripts/linux/apktool && \
	curl -L -o apktool.jar https://bitbucket.org/iBotPeaches/apktool/downloads/apktool_2.0.2.jar && \
	sudo mv apktool /usr/local/bin && \
	sudo mv apktool.jar /usr/local/bin && \
	sudo chmod +x /usr/local/bin/apktool && \
	sudo chmod +x /usr/local/bin/apktool.jar && \
	sudo -u ubuntu -i bash -l -c "nvm install 4.2.6" && \
	sudo -u ubuntu -i bash -l -c "nvm alias default 4.2.6"

# clone & install c9sdk
RUN sudo -u ubuntu -i bash -l -c "git  clone  https://github.com/serkanserttop/core /home/ubuntu/c9sdk" && \
    chmod -R g+w /home/ubuntu/c9sdk && \
    chown -R ubuntu:ubuntu /home/ubuntu/c9sdk && \ 
    sudo -u ubuntu -i bash -l -c "cd /home/ubuntu/c9sdk; \
                                  git checkout test-env-git; \
                                  git submodule update --init; \
                                  ./scripts/install-sdk.sh;" 

# install c9 cli tool
RUN sudo -u ubuntu -i bash -l -c "npm i -g c9"

# clone & install cli tool
RUN sudo -u ubuntu -i bash -l -c "git clone https://github.com/smartfaceio/smfc /home/ubuntu/smfc" && \
    chmod -R g+w /home/ubuntu/smfc && \
    chown -R ubuntu:ubuntu /home/ubuntu/smfc && \
    sudo -u ubuntu -i bash -l -c "cd /home/ubuntu/smfc; \
                                  git checkout cloud_master; \
                                  npm i -g . ;"

# clone & install smfc-c9
RUN sudo -u ubuntu -i bash -l -c "git clone https://github.com/smartfaceio/smfc-c9 /home/ubuntu/smfc-c9" && \
    chmod -R g+w /home/ubuntu/smfc-c9 && \
    chown -R ubuntu:ubuntu /home/ubuntu/smfc-c9 && \
    sudo -u ubuntu -i bash -l -c "cd /home/ubuntu/smfc-c9; \
                                  npm i -g .;"

# clone & install dispatcher
RUN sudo -u ubuntu -i bash -l -c "git clone https://github.com/smartfaceio/npm-emulator-dispatcher /home/ubuntu/dispatcher" && \
    sudo -u ubuntu -i bash -l -c "cd /home/ubuntu/dispatcher; \
                                  npm i -g .;"

# clone workspace
RUN	sudo -u ubuntu -i bash -l -c "git clone https://github.com/SmartfaceIO/smfc-empty-workspace /home/ubuntu/workspace" && \
	chmod -R g+w /home/ubuntu/workspace && \
	chown -R ubuntu:ubuntu /home/ubuntu/workspace

RUN sudo -u ubuntu -i bash -l -c "source ~/.nvm/nvm.sh;"

USER ubuntu
WORKDIR /home/ubuntu

EXPOSE 8080
EXPOSE 8081

CMD /home/ubuntu/.nvm/versions/node/v4.2.6/bin/node /home/ubuntu/c9sdk/server.js -l 0.0.0.0 -p 8080 -a : -w /home/ubuntu/workspace --workspace smartface --smf
