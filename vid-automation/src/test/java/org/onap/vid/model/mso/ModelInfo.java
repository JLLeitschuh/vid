package org.onap.vid.model.mso;

import com.fasterxml.jackson.annotation.*;

import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
"modelType",
"modelInvariantId",
"modelVersionId",
"modelName",
"modelVersion",
"modelCustomizationName",
"modelCustomizationId"
})
public class ModelInfo {

	public ModelInfo(){

	}

	@JsonProperty("modelType")
	private String modelType;
	@JsonProperty("modelInvariantId")
	private String modelInvariantId;
	@JsonProperty("modelVersionId")
	private String modelVersionId;
	@JsonProperty("modelName")
	private String modelName;
	@JsonProperty("modelVersion")
	private String modelVersion;
	@JsonProperty("modelCustomizationName")
	private String modelCustomizationName;
	@JsonProperty("modelCustomizationId")
	private String modelCustomizationId;
	@JsonIgnore
	private Map<String, Object> additionalProperties = new HashMap<String, Object>();

	@JsonProperty("modelType")
	public String getModelType() {
	return modelType;
	}

	@JsonProperty("modelType")
	public void setModelType(String modelType) {
	this.modelType = modelType;
	}

	@JsonProperty("modelInvariantId")
	public String getModelInvariantId() {
	return modelInvariantId;
	}

	@JsonProperty("modelInvariantId")
	public void setModelInvariantId(String modelInvariantId) {
	this.modelInvariantId = modelInvariantId;
	}

	@JsonProperty("modelVersionId")
	public String getModelVersionId() {
	return modelVersionId;
	}

	@JsonProperty("modelVersionId")
	public void setModelVersionId(String modelVersionId) {
	this.modelVersionId = modelVersionId;
	}

	@JsonProperty("modelName")
	public String getModelName() {
	return modelName;
	}

	@JsonProperty("modelName")
	public void setModelName(String modelName) {
	this.modelName = modelName;
	}

	@JsonProperty("modelVersion")
	public String getModelVersion() {
	return modelVersion;
	}

	@JsonProperty("modelVersion")
	public void setModelVersion(String modelVersion) {
	this.modelVersion = modelVersion;
	}

	@JsonProperty("modelCustomizationName")
	public String getModelCustomizationName() {
	return modelCustomizationName;
	}

	@JsonProperty("modelCustomizationName")
	public void setModelCustomizationName(String modelCustomizationName) {
	this.modelCustomizationName = modelCustomizationName;
	}

	@JsonProperty("modelCustomizationId")
	public String getModelCustomizationId() {
	return modelCustomizationId;
	}

	@JsonProperty("modelCustomizationId")
	public void setModelCustomizationId(String modelCustomizationId) {
	this.modelCustomizationId = modelCustomizationId;
	}

	@JsonAnyGetter
	public Map<String, Object> getAdditionalProperties() {
	return this.additionalProperties;
	}

	@JsonAnySetter
	public void setAdditionalProperty(String name, Object value) {
	this.additionalProperties.put(name, value);
	}




}
