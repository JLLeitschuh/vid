/*-
 * ============LICENSE_START=======================================================
 * VID
 * ================================================================================
 * Copyright (C) 2017 - 2019 AT&T Intellectual Property. All rights reserved.
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

package org.onap.vid.aai.model;

import com.fasterxml.jackson.annotation.*;

import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({
        "service-instance-id",
        "service-instance-name",
        "model-invariant-id",
        "model-version-id",
        "resource-version",
        "orchestration-status",
        "global-customer-id",
        "subscriber-name",
        "subscriber-type",
        "vnf-id",
        "vnf-name",
        "vnf-type",
        "service-id",
        "prov-status",
        "in-maint",
        "is-closed-loop-disabled",
        "model-customization-id",
        "nf-type",
        "nf-function",
        "nf-role",
        "nf-naming-code"
})
public class ServiceProperties {

    @JsonProperty("service-instance-id")
    public String serviceInstanceId;
    @JsonProperty("service-instance-name")
    public String serviceInstanceName;
    @JsonProperty("model-invariant-id")
    public String modelInvariantId;
    @JsonProperty("model-version-id")
    public String modelVersionId;
    @JsonProperty("resource-version")
    public String resourceVersion;
    @JsonProperty("orchestration-status")
    public String orchestrationStatus;
    @JsonProperty("global-customer-id")
    public String globalCustomerId;
    @JsonProperty("subscriber-name")
    public String subscriberName;
    @JsonProperty("subscriber-type")
    public String subscriberType;
    @JsonProperty("vnf-id")
    public String vnfId;
    @JsonProperty("vnf-name")
    public String vnfName;
    @JsonProperty("vnf-type")
    public String vnfType;
    @JsonProperty("service-id")
    public String serviceId;
    @JsonProperty("prov-status")
    public String provStatus;
    @JsonProperty("in-maint")
    public Boolean inMaint;
    @JsonProperty("is-closed-loop-disabled")
    public Boolean isClosedLoopDisabled;
    @JsonProperty("model-customization-id")
    public String modelCustomizationId;
    @JsonProperty("nf-type")
    public String nfType;
    @JsonProperty("nf-function")
    public String nfFunction;
    @JsonProperty("nf-role")
    public String nfRole;
    @JsonProperty("nf-naming-code")
    public String nfNamingCode;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<>();

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

}
