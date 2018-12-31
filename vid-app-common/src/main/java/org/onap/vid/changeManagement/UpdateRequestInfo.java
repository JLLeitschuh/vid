package org.onap.vid.changeManagement;

import org.onap.vid.mso.model.RequestInfo;

/**
 * Created by Oren on 9/5/17.
 */
public class UpdateRequestInfo {

    public UpdateRequestInfo() {
    }


    public UpdateRequestInfo(RequestInfo requestInfo) {
        this.requestorId = requestInfo.getRequestorId();
        this.suppressRollback = requestInfo.getSuppressRollback();
        this.source = requestInfo.getSource();
    }
    public String source;

    public  Boolean suppressRollback;

    public String requestorId;


}
