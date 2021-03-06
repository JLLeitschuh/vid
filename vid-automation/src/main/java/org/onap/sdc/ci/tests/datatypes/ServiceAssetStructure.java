/*-
 * ============LICENSE_START=======================================================
 * SDC
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

package org.onap.sdc.ci.tests.datatypes;

public class ServiceAssetStructure extends AssetStructure {

	private String distributionStatus;

	public ServiceAssetStructure() {
		super();
	}

	public ServiceAssetStructure(String uuid, String invariantUUID, String name, String version, String toscaModelURL,
			String category, String lifecycleState, String lastUpdaterUserId) {
		super(uuid, invariantUUID, name, version, toscaModelURL, category, lifecycleState, lastUpdaterUserId);
	}

	@Override
	public String toString() {
		return "ServiceAssetStructure [distributionStatus=" + distributionStatus + "]";
	}

	public String getDistributionStatus() {
		return distributionStatus;
	}

	public void setDistributionStatus(String distributionStatus) {
		this.distributionStatus = distributionStatus;
	}

}
