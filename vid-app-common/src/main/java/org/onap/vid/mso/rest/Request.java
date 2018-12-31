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

package org.onap.vid.mso.rest;

import com.fasterxml.jackson.annotation.*;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.util.HashMap;
import java.util.Map;


/**
 * request structure.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "finishTime",
    "instanceIds",
    "requestDetails",
    "requestId",
    "requestScope",
    "requestStatus",
    "requestType",
    "startTime"
})
public class Request {

 
    /** The instance ids. */
    @JsonProperty("instanceIds")
    private InstanceIds instanceIds;
    
    /** The request details. */
    @JsonProperty("requestDetails")
    private RequestDetails requestDetails;
    
    /** The request status. */
    @JsonProperty("requestStatus")
    private RequestStatus requestStatus;

    /**
     * Date and time the request was finished in GMT with the following sample format: Wed, 15 Oct 2014 13:01:52 GMT
     *
     */
    @JsonProperty("finishTime")
    private String finishTime;

    /**
     * UUID for the request generated by the instantiation service
     * (Required)
     *
     */
    @JsonProperty("requestId")
    private String requestId;

    /**
     * short description of the entity being operated on
     * (Required)
     *
     */
    @JsonProperty("requestScope")
    private String requestScope;

    /**
     * short description of the action being performed on the requestScope
     * (Required)
     *
     */
    @JsonProperty("requestType")
    private String requestType;

    /**
     * Date and time the request was created in GMT with the following sample format: Wed, 15 Oct 2014 13:01:52 GMT
     * (Required)
     *
     */
    @JsonProperty("startTime")
    private String startTime;

    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<>();


    /* (non-Javadoc)
     * @see org.openecomp.vid.domain.mso.Request#getInstanceIds()
     */
    @JsonProperty("instanceIds")
    public InstanceIds getInstanceIds() {
        return instanceIds;
    }

    /**
     * Sets the instance ids.
     *
     * @param instanceIds     The instanceIds
     */
    @JsonProperty("instanceIds")
    public void setInstanceIds(InstanceIds instanceIds) {
        this.instanceIds = instanceIds;
    }

    /**
     * (Required).
     *
     * @return     The requestDetails
     */
    @JsonProperty("requestDetails")
    public RequestDetails getRequestDetails() {
        return requestDetails;
    }

    /**
     * (Required).
     *
     * @param requestDetails     The requestDetails
     */
    @JsonProperty("requestDetails")
    public void setRequestDetails(RequestDetails requestDetails) {
        this.requestDetails = requestDetails;
    }

    
    /**
     * Gets the request status.
     *
     * @return     The requestStatus
     */
    @JsonProperty("requestStatus")
    public RequestStatus getRequestStatus() {
        return requestStatus;
    }

    /**
     * Sets the request status.
     *
     * @param requestStatus     The requestStatus
     */
    @JsonProperty("requestStatus")
    public void setRequestStatus(RequestStatus requestStatus) {
        this.requestStatus = requestStatus;
    }

    /**
     * Date and time the request was finished in GMT with the following sample format: Wed, 15 Oct 2014 13:01:52 GMT
     *
     * @return
     *     The finishTime
     */
    @JsonProperty("finishTime")
    public String getFinishTime() {
        return finishTime;
    }

    /**
     * Date and time the request was finished in GMT with the following sample format: Wed, 15 Oct 2014 13:01:52 GMT
     *
     * @param finishTime
     *     The finishTime
     */
    @JsonProperty("finishTime")
    public void setFinishTime(String finishTime) {
        this.finishTime = finishTime;
    }

    /**
     * UUID for the request generated by the instantiation service
     * (Required)
     *
     * @return
     *     The requestId
     */
    @JsonProperty("requestId")
    public String getRequestId() {
        return requestId;
    }

    /**
     * UUID for the request generated by the instantiation service
     * (Required)
     *
     * @param requestId
     *     The requestId
     */
    @JsonProperty("requestId")
    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    /**
     * short description of the entity being operated on
     * (Required)
     *
     * @return
     *     The requestScope
     */
    @JsonProperty("requestScope")
    public String getRequestScope() {
        return requestScope;
    }

    /**
     * short description of the entity being operated on
     * (Required)
     *
     * @param requestScope
     *     The requestScope
     */
    @JsonProperty("requestScope")
    public void setRequestScope(String requestScope) {
        this.requestScope = requestScope;
    }

    /**
     * short description of the action being performed on the requestScope
     * (Required)
     *
     * @return
     *     The requestType
     */
    @JsonProperty("requestType")
    public String getRequestType() {
        return requestType;
    }

    /**
     * short description of the action being performed on the requestScope
     * (Required)
     *
     * @param requestType
     *     The requestType
     */
    @JsonProperty("requestType")
    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    /**
     * Date and time the request was created in GMT with the following sample format: Wed, 15 Oct 2014 13:01:52 GMT
     * (Required)
     *
     * @return
     *     The startTime
     */
    @JsonProperty("startTime")
    public String getStartTime() {
        return startTime;
    }

    /**
     * Date and time the request was created in GMT with the following sample format: Wed, 15 Oct 2014 13:01:52 GMT
     * (Required)
     *
     * @param startTime
     *     The startTime
     */
    @JsonProperty("startTime")
    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(getFinishTime()).append(getInstanceIds()).append(getRequestDetails()).append(getRequestId()).append(getRequestScope()).append(getRequestStatus()).append(getRequestType()).append(getStartTime()).append(getAdditionalProperties()).toHashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof Request)) {
            return false;
        }
        Request rhs = ((Request) other);
        return new EqualsBuilder().append(getFinishTime(), rhs.getFinishTime()).append(getInstanceIds(), rhs.getInstanceIds()).append(getRequestDetails(), rhs.getRequestDetails()).append(getRequestId(), rhs.getRequestId()).append(getRequestScope(), rhs.getRequestScope()).append(getRequestStatus(), rhs.getRequestStatus()).append(getRequestType(), rhs.getRequestType()).append(getStartTime(), rhs.getStartTime()).append(getAdditionalProperties(), rhs.getAdditionalProperties()).isEquals();
    }

}
