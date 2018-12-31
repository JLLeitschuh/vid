
package org.onap.vid.mso.model;

import com.fasterxml.jackson.annotation.*;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "subscriptionServiceType",
    "testApi",
    "userParams"
})
public class RequestParameters {

    @JsonProperty("subscriptionServiceType")
    private String subscriptionServiceType;
    @JsonProperty("testApi")
    private String testApi;
    @JsonProperty("userParams")
    private List<UserParam> userParams = new ArrayList<>();
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<>();

    /**
     * 
     * @return
     *     The subscriptionServiceType
     */
    @JsonProperty("subscriptionServiceType")
    public String getSubscriptionServiceType() {
        return subscriptionServiceType;
    }

    /**
     * 
     * @param subscriptionServiceType
     *     The subscriptionServiceType
     */
    @JsonProperty("subscriptionServiceType")
    public void setSubscriptionServiceType(String subscriptionServiceType) {
        this.subscriptionServiceType = subscriptionServiceType;
    }

    /**
     * 
     * @return
     *     The testApi
     */
    @JsonProperty("testApi")
    public String getTestApi() {
        return testApi;
    }

    /**
     * 
     * @param testApi
     *     The testApi
     */
    @JsonProperty("testApi")
    public void setTestApi(String testApi) {
        this.testApi = testApi;
    }

    /**
     * 
     * @return
     *     The userParams
     */
    @JsonProperty("userParams")
    public List<UserParam> getUserParams() {
        return userParams;
    }

    /**
     * 
     * @param userParams
     *     The userParams
     */
    @JsonProperty("userParams")
    public void setUserParams(List<UserParam> userParams) {
        this.userParams = userParams;
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
        return new HashCodeBuilder().append(subscriptionServiceType).append(testApi).append(userParams).append(additionalProperties).toHashCode();
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if (!(other instanceof RequestParameters)) {
            return false;
        }
        RequestParameters rhs = ((RequestParameters) other);
        return new EqualsBuilder().append(subscriptionServiceType, rhs.subscriptionServiceType).append(testApi, rhs.testApi).append(userParams, rhs.userParams).append(additionalProperties, rhs.additionalProperties).isEquals();
    }

}
