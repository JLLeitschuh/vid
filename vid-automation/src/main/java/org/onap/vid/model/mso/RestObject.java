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

package org.onap.vid.model.mso;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.MoreObjects;

import javax.ws.rs.core.Response;

/**
 * The Class RestObject.
 *
 * @param <T> the generic type
 */
public class RestObject<T> {

    final static ObjectMapper objectMapper = new ObjectMapper();

	/**
	 * Generic version of the RestObject class.
	 *
	 */
    // T stands for "Type"
    private T t;
    
    // The string source of t, if available
    private String rawT;

    /** The status code. */
    private int statusCode= 0;

    public RestObject() {
    }

    public RestObject(Response cres, Class<?> tClass) {

        String rawEntity = null;
        try {
            cres.bufferEntity();
            rawEntity = cres.readEntity(String.class);
            T t = (T) objectMapper.readValue(rawEntity, tClass);
            this.set(t);
        }
        catch ( Exception e ) {
            try {
                this.setRaw(rawEntity);
            } catch (Exception e2) {
            }
        }

        int status = cres.getStatus();
        this.setStatusCode (status);
    }


    /**
     * Sets the.
     *
     * @param t the t
     */
    public void set(T t) { this.t = t; }
    
    /**
     * Gets the.
     *
     * @return the t
     */
    public T get() { return t; }
	
    /**
     * Sets the status code.
     *
     * @param v the new status code
     */
    public void setStatusCode(int v) { this.statusCode = v; }
    
    /**
     * Gets the status code.
     *
     * @return the status code
     */
    public int getStatusCode() { return this.statusCode; }

    public String getRaw() {
        return rawT;
    }

    public void setRaw(String rawT) {
        this.rawT = rawT;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("t", t)
                .add("rawT", rawT)
                .add("statusCode", statusCode)
                .toString();
    }
}

