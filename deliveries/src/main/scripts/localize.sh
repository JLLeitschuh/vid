#!/bin/bash

fillTemplateProperties() {
  source /tmp/vid/localize_war.sh $1 || {
  	echo "ERROR: Localization script failed"
  	exit 2
  }
}

createWritableLogbackConfig() {
  # Create logback.xml in /tmp/vid/
  # /tmp/logback.xml is owned by root and unmodifiable
  cp -f /tmp/logback.xml /tmp/vid/logback.xml
}

deployWarOnTomcatManually() {
  cd /usr/local/tomcat/webapps/
  mkdir vid
  cd vid
  jar -xf /tmp/vid/stage/vid.war
}


createWritableLogbackConfig
deployWarOnTomcatManually

TEMPLATES_BASE_DIR=/usr/local/tomcat/webapps/vid/WEB-INF

fillTemplateProperties ${TEMPLATES_BASE_DIR}

# Set CATALINA_OPTS if not defined previously
# Enables late-evaluation of env variables, such as VID_KEYSTORE_PASSWORD
: "${CATALINA_OPTS:=-Dvid.keystore.password=${VID_KEYSTORE_PASSWORD} -Dvid.keyalias=vid@vid.onap.org -Dvid.keystore.filename=${VID_KEYSTORE_FILENAME} -Dcom.att.eelf.logging.file=logback.xml -Dcom.att.eelf.logging.path=/tmp/vid/}"
echo "CATALINA_OPTS: ${CATALINA_OPTS}"
export CATALINA_OPTS

catalina.sh run
