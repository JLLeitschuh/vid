/*-
 * ============LICENSE_START=======================================================
 * VID
 * ================================================================================
 * Copyright (C) 2017 AT&T Intellectual Property. All rights reserved.
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 */

package org.openecomp.vid.properties;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.openecomp.vid.model.ModelConstants;
import org.openecomp.portalsdk.core.util.SystemProperties;
import org.openecomp.portalsdk.core.logging.logic.EELFLoggerDelegate;

import org.openecomp.vid.controller.VidController;
/**
 * The Class VidProperties.
 */
public class VidProperties extends SystemProperties {

	//VID General Properties
	
	/** The Constant VID_TRUSTSTORE_FILENAME. */
	public static final String VID_TRUSTSTORE_FILENAME = "vid.truststore.filename";
	
	/** The Constant VID_TRUSTSTORE_PASSWD_X. */
	public static final String VID_TRUSTSTORE_PASSWD_X = "vid.truststore.passwd.x";
	
	/** The Constant FILESEPARATOR. */
	public static final String FILESEPARATOR = (System.getProperty("file.separator") == null) ? "/" : System.getProperty("file.separator");
	
	/** The Constant LOG. */
	private static final EELFLoggerDelegate LOG = EELFLoggerDelegate.getLogger(VidController.class);
	
	/** The Constant dateFormat. */
	final static DateFormat dateFormat = new SimpleDateFormat("HH:mm:ss:SSSS");
	/**
	 * Gets the asdc model namespace prefix property
	 * 
	 * @return the property value or a default value
	 */
	public static String getAsdcModelNamespace() {
		String methodName = "getAsdcModelNamespace ";
		String asdcModelNamespace = ModelConstants.DEFAULT_ASDC_MODEL_NAMESPACE;
	    try {
	        asdcModelNamespace = SystemProperties.getProperty(ModelConstants.ASDC_MODEL_NAMESPACE);
	        if ( asdcModelNamespace == null || asdcModelNamespace.isEmpty()) {
		    	asdcModelNamespace = ModelConstants.DEFAULT_ASDC_MODEL_NAMESPACE;
		    }
	    }
	    catch ( Exception e ) {
	    	LOG.error (EELFLoggerDelegate.errorLogger, dateFormat.format(new Date()) + methodName + "unable to find the value, using the default "
	    			+ ModelConstants.DEFAULT_ASDC_MODEL_NAMESPACE);
	    	asdcModelNamespace = ModelConstants.DEFAULT_ASDC_MODEL_NAMESPACE;
	    }
	    return (asdcModelNamespace);
	}
	/**
	 * Gets the specified property value. If the property is not defined, returns a default value.
	 * 
	 * @return the property value or a default value
	 */
	public static String getPropertyWithDefault ( String propName, String defaultValue ) {
		String methodName = "getPropertyWithDefault ";
		String propValue = defaultValue;
	    try {
	        propValue = SystemProperties.getProperty(propName);
	        if ( propValue == null || propValue.isEmpty()) {
		    	propValue = defaultValue;
		    }
	    }
	    catch ( Exception e ) {
	    	LOG.error (EELFLoggerDelegate.errorLogger, dateFormat.format(new Date()) + methodName + "unable to find the value, using the default "
	    			+ defaultValue);
	    	propValue = defaultValue;
	    }
	    return (propValue);
	}
}