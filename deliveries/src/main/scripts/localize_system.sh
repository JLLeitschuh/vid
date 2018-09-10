#!/bin/bash

FINAL_CONFIG_FILE=/tmp/vid/stage/WEB-INF/conf/system.properties
TEMPLATE_CONFIG_FILE=/tmp/vid/stage/WEB-INF/conf/system_template.properties

echo "Localizing the VID system configuration"

mkdir -p "${VID_MYLOGIN_FEED_DIRECTORY}"


sed -e 's/${VID_MYSQL_HOST}/'${VID_MYSQL_HOST}'/g' \
	-e 's/${VID_MYSQL_PORT}/'${VID_MYSQL_PORT}'/g' \
	-e 's/${VID_MYSQL_DBNAME}/'${VID_MYSQL_DBNAME}'/g' \
	-e 's/${VID_MYSQL_USER}/'${VID_MYSQL_USER}'/g' \
	-e 's/${VID_MYSQL_PASS}/'${VID_MYSQL_PASS}'/g' \
	-e 's/${VID_AAI_HOST}/'${VID_AAI_HOST}'/g' \
	-e 's/${VID_AAI_PORT}/'${VID_AAI_PORT}'/g' \
	-e 's/${AAI_USE_CLIENT_CERT}/'${AAI_USE_CLIENT_CERT}'/g' \
	-e 's/${AAI_VID_UID}/'${AAI_VID_UID}'/g' \
	-e 's/${AAI_VID_PASSWD_X}/'${AAI_VID_PASSWD_X}'/g' \
	-e 's,${AAI_TRUSTSTORE_FILENAME},'${AAI_TRUSTSTORE_FILENAME}',g' \
	-e 's/${AAI_TRUSTSTORE_PASSWD_X}/'${AAI_TRUSTSTORE_PASSWD_X}'/g' \
	-e 's,${AAI_KEYSTORE_FILENAME},'${AAI_KEYSTORE_FILENAME}',g' \
	-e 's/${AAI_KEYSTORE_PASSWD_X}/'${AAI_KEYSTORE_PASSWD_X}'/g' \
	-e 's/${VID_APP_DISPLAY_NAME}/'${VID_APP_DISPLAY_NAME}'/g' \
	-e 's ${VID_ECOMP_SHARED_CONTEXT_REST_URL} '${VID_ECOMP_SHARED_CONTEXT_REST_URL}' g' \
	-e 's ${VID_ECOMP_REDIRECT_URL} '${VID_ECOMP_REDIRECT_URL}' g' \
	-e 's ${VID_ECOMP_REST_URL} '${VID_ECOMP_REST_URL}' g' \
	-e 's ${VID_MSO_SERVER_URL} '${VID_MSO_SERVER_URL}' g' \
	-e 's/${VID_MSO_USER}/'${VID_MSO_USER}'/g' \
	-e 's/${VID_MSO_PASS}/'${VID_MSO_PASS}'/g' \
	-e 's,${VID_MYLOGIN_FEED_DIRECTORY},'${VID_MYLOGIN_FEED_DIRECTORY}',g' \
	-e 's,${MSO_DME2_CLIENT_TIMEOUT},'${MSO_DME2_CLIENT_TIMEOUT}',g' \
	-e 's,${MSO_DME2_CLIENT_READ_TIMEOUT},'${MSO_DME2_CLIENT_READ_TIMEOUT}',g' \
	-e 's,${MSO_DME2_SERVER_URL},'${MSO_DME2_SERVER_URL}',g' \
	-e 's,${MSO_DME2_ENABLED},'${MSO_DME2_ENABLED}',g' \
	-e 's,${MSO_POLLING_INTERVAL_MSECS},'${MSO_POLLING_INTERVAL_MSECS}',g' \
	-e 's,${VID_TRUSTSTORE_FILE},'${VID_TRUSTSTORE_FILENAME}',g' \
	-e 's/${VID_TRUSTSTORE_PASS}/'${VID_TRUSTSTORE_PASSWORD}'/g' ${TEMPLATE_CONFIG_FILE} > ${FINAL_CONFIG_FILE} || {
		echo "ERROR: Could not process template file ${TEMPLATE_CONFIG_FILE} into ${FINAL_CONFIG_FILE}"
		exit 4
	}

echo "Localized ${FINAL_CONFIG_FILE} successfully."
