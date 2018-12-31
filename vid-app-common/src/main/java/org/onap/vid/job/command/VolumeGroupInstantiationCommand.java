package org.onap.vid.job.command;


import org.apache.commons.lang3.StringUtils;
import org.onap.vid.changeManagement.RequestDetailsWrapper;
import org.onap.vid.job.*;
import org.onap.vid.job.command.CommandParentData.CommandDataKey;
import org.onap.vid.model.serviceInstantiation.VfModule;
import org.onap.vid.mso.model.VolumeGroupRequestDetails;
import org.onap.vid.services.AsyncInstantiationBusinessLogic;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.inject.Inject;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class VolumeGroupInstantiationCommand extends ResourceInstantiationCommand {
    @Inject
    private AsyncInstantiationBusinessLogic asyncInstantiationBL;

    @Inject
    protected JobsBrokerService jobsBrokerService;

    @Inject
    protected JobAdapter jobAdapter;

    @Override
    protected String getRequestPath() {
        return asyncInstantiationBL.getVolumeGroupInstantiationPath(commandParentData.getInstanceId(CommandDataKey.SERVICE_INSTANCE_ID),commandParentData.getInstanceId(CommandDataKey.VNF_INSTANCE_ID));
    }

    @Override
    protected RequestDetailsWrapper<VolumeGroupRequestDetails> generateMSORequest(JobAdapter.AsyncJobRequest request, String userId) {
        return asyncInstantiationBL.generateVolumeGroupInstantiationRequest(
                (VfModule) getSharedData().getRequest(),
                commandParentData.getModelInfo(CommandDataKey.SERVICE_MODEL_INFO),
                commandParentData.getInstanceId(CommandDataKey.SERVICE_INSTANCE_ID),
                commandParentData.getModelInfo(CommandDataKey.VNF_MODEL_INFO),
                commandParentData.getInstanceId(CommandDataKey.VNF_INSTANCE_ID),
                getSharedData().getUserId()
        );
    }

    @Override
    protected NextCommand getNextCommand(String requestId, String instanceId){
        return new NextCommand(
                Job.JobStatus.RESOURCE_IN_PROGRESS,
                new VolumeGroupInProgressStatusCommand(getSharedData(), requestId, instanceId, commandParentData)
        );
    }

    @Override
    protected String getJobAuditMSOStatus() {
        return "VOLUME_GROUP_REQUESTED";
    }

    @Override
    public NextCommand call() {
        String vgName = ((VfModule)getSharedData().getRequest()).getVolumeGroupInstanceName();
        if(StringUtils.isNotEmpty(vgName)){
            return super.call();//create volume group
        }else {
            //go to vf module creation
            VfModule request = (VfModule) getSharedData().getRequest();
            Map<String, Object> dataForChild = buildDataForChild();
            List<String> vfModuleJob = Collections.singletonList(jobsBrokerService.add(
                    jobAdapter.createChildJob(JobType.VfmoduleInstantiation, Job.JobStatus.CREATING, request, getSharedData(), dataForChild)).toString());

            return new NextCommand(Job.JobStatus.RESOURCE_IN_PROGRESS, new WatchingCommand(getSharedData(), vfModuleJob, false));
        }

    }

    private Map<String, Object> buildDataForChild() {
       return commandParentData.getParentData();
    }

}
