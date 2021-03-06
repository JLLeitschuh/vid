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

package org.onap.vid.services;

import org.onap.vid.job.Job;
import org.onap.vid.job.JobAdapter;
import org.onap.vid.job.JobsBrokerService;
import org.onap.vid.model.JobModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.ws.rs.NotFoundException;
import java.util.UUID;

@Service
public class BulkInstantiationServiceImpl implements BulkInstantiationService {

    private JobsBrokerService jobsBrokerService;
    private JobAdapter jobAdapter;

    @Autowired
    public BulkInstantiationServiceImpl(JobsBrokerService jobsBrokerService, JobAdapter jobAdapter) {
        this.jobsBrokerService = jobsBrokerService;
        this.jobAdapter = jobAdapter;
    }

    @Override
    public JobModel getJob(UUID uuid) {
        Job job = jobsBrokerService.peek(uuid);

        if (job == null || job.getUuid() == null) {
            throw new NotFoundException("Job with uuid " + uuid + " not found");
        }
        return jobAdapter.toModel(job);
    }


}
