package org.onap.simulator.presetGenerator.presets.mso;

import com.google.common.collect.ImmutableMap;
import org.onap.simulator.presetGenerator.presets.BasePresets.BaseMSOPreset;
import org.springframework.http.HttpMethod;

import java.util.List;
import java.util.Map;

import static java.util.Collections.singletonList;

public class PresetMSOOrchestrationRequestsManyStatusesGet extends BaseMSOPreset {

    @Override
    public HttpMethod getReqMethod() {
        return HttpMethod.GET;
    }

    @Override
    public String getReqPath() {
        return getRootPath() + "/orchestrationRequests/v.";
    }

    @Override
    public Map<String, List> getQueryParams() {
        return ImmutableMap.of("filter", singletonList("requestExecutionDate:EQUALS:01-01-2100"));
    }

    @Override
    public Object getResponseBody() {
        return "" +
                "{ " +
                " \"requestList\": [{ " +
                "   \"request\": { " +
                "    \"requestId\": \"rq1234d1-5a33-55df-13ab-12abad84e333\", " +
                "    \"startTime\": \"Thu, 04 Jun 2009 02:51:59 GMT\", " +
                "    \"instanceReferences\": { " +
                "     \"serviceInstanceId\": \"bc305d54-75b4-431b-adb2-eb6b9e546014\" " +
                "    }, " +
                "    \"requestScope\": \"vnf\", " +
                "    \"requestType\": \"updateInstance\", " +
                "    \"requestDetails\": { " +
                "     \"modelInfo\": { " +
                "      \"modelType\": \"service\", " +
                "      \"modelInvariantId\": \"sn5256d1-5a33-55df-13ab-12abad84e764\", " +
                "      \"modelVersionId\": \"ab6478e4-ea33-3346-ac12-ab121484a333\", " +
                "      \"modelName\": \"WanBonding\", " +
                "      \"modelVersion\": \"1.0\" " +
                "     }, " +
                "     \"subscriberInfo\": { " +
                "      \"globalSubscriberId\": \"C12345\", " +
                "      \"subscriberName\": \"General Electric Division 12\" " +
                "     }, " +
                "     \"requestInfo\": { " +
                "      \"instanceName\": \"WanBonding Service\", " +
                "      \"source\": \"VID\", " +
                "      \"suppressRollback\": true, " +
                "      \"requestorId\": \"ah2345\" " +
                "     }, " +
                "     \"requestParameters\": { " +
                "      \"subscriptionServiceType\": \"Trinity\" " +
                "     } " +
                "    }, " +
                "    \"requestStatus\": { " +
                "     \"timestamp\": \"Thu, 04 Jun 2009 02:53:39 GMT\", " +
                "     \"requestState\": \"Complete\", " +
                "     \"statusMessage\": \"Service created successfully\", " +
                "     \"percentProgress\": \"100\" " +
                "    } " +
                "   } " +
                "  }, { " +
                "   \"request\": { " +
                "    \"requestId\": \"25faf364-6031-4f58-9703-26955815562a\", " +
                "    \"startTime\": \"Thu, 30 Jun 2009 03:52:59 GMT\", " +
                "    \"instanceReferences\": { " +
                "     \"serviceInstanceId\": \"bc305d54-75b4-431b-adb2-eb6b9e546014\" " +
                "    }, " +
                "    \"requestScope\": \"vnf\", " +
                "    \"requestType\": \"applyUpdatedConfig\", " +
                "    \"requestDetails\": { " +
                "     \"modelInfo\": { " +
                "      \"modelType\": \"service\", " +
                "      \"modelInvariantId\": \"sn5256d1-5a33-55df-13ab-12abad84e764\", " +
                "      \"modelName\": \"WanBonding\", " +
                "      \"modelVersion\": \"1.0\" " +
                "     }, " +
                "     \"requestInfo\": { " +
                "      \"source\": \"VID\" " +
                "     } " +
                "    }, " +
                "    \"requestStatus\": { " +
                "     \"timestamp\": \"Thu, 30 Jun 2009 03:53:39 GMT\", " +
                "     \"requestState\": \"IN_PROGRESS\", " +
                "     \"statusMessage\": \"\", " +
                "     \"percentProgress\": \"30\" " +
                "    } " +
                "   } " +
                "  }, { " +
                "   \"request\": { " +
                "    \"requestId\": \"eaee7411-9281-4c25-a65f-aad5a725a61a\", " +
                "    \"startTime\": \"Thu, 30 Jun 2009 03:52:59 GMT\", " +
                "    \"instanceReferences\": { " +
                "     \"serviceInstanceId\": \"28d8a15f-c32c-475f-a7ae-5d23f3caee0e\" " +
                "    }, " +
                "    \"requestScope\": \"vnf\", " +
                "    \"requestType\": \"applyUpdatedConfig\", " +
                "    \"requestDetails\": { " +
                "     \"modelInfo\": { " +
                "      \"modelType\": \"service\", " +
                "      \"modelInvariantId\": \"sn5256d1-5a33-55df-13ab-12abad84e764\", " +
                "      \"modelName\": \"WanBonding\", " +
                "      \"modelVersion\": \"1.0\" " +
                "     }, " +
                "     \"requestInfo\": { " +
                "      \"source\": \"VID\" " +
                "     } " +
                "    }, " +
                "    \"requestStatus\": { " +
                "     \"timestamp\": \"Thu, 30 Jun 2009 03:53:39 GMT\", " +
                "     \"requestState\": \"PENDING\", " +
                "     \"statusMessage\": \"\", " +
                "     \"percentProgress\": \"30\" " +
                "    } " +
                "   } " +
                "  }, { " +
                "   \"request\": { " +
                "    \"requestId\": \"da6c17ba-4e8c-4983-b000-e4dcdbb60a51\", " +
                "    \"startTime\": \"Thu, 30 Jun 2009 03:52:59 GMT\", " +
                "    \"instanceReferences\": { " +
                "     \"serviceInstanceId\": \"39b5f85b-60bd-4ca6-8586-8340182b89b7\" " +
                "    }, " +
                "    \"requestScope\": \"vnf\", " +
                "    \"requestType\": \"applyUpdatedConfig\", " +
                "    \"requestDetails\": { " +
                "     \"modelInfo\": { " +
                "      \"modelType\": \"service\", " +
                "      \"modelInvariantId\": \"sn5256d1-5a33-55df-13ab-12abad84e764\", " +
                "      \"modelName\": \"WanBonding\", " +
                "      \"modelVersion\": \"1.0\" " +
                "     }, " +
                "     \"requestInfo\": { " +
                "      \"source\": \"VID\" " +
                "     } " +
                "    }, " +
                "    \"requestStatus\": { " +
                "     \"timestamp\": \"Thu, 30 Jun 2009 03:53:39 GMT\", " +
                "     \"requestState\": \"PENDING_MANUAL_TASK\", " +
                "     \"statusMessage\": \"\", " +
                "     \"percentProgress\": \"30\" " +
                "    } " +
                "   } " +
                "  }, { " +
                "   \"request\": { " +
                "    \"requestId\": \"7d6b6261-bede-4bfb-bde3-f225d63ee315\", " +
                "    \"startTime\": \"Thu, 30 Jun 2009 03:52:59 GMT\", " +
                "    \"instanceReferences\": { " +
                "     \"serviceInstanceId\": \"d4f74570-a03b-40f6-abe1-e979467ebbc1\" " +
                "    }, " +
                "    \"requestScope\": \"vnf\", " +
                "    \"requestType\": \"applyUpdatedConfig\", " +
                "    \"requestDetails\": { " +
                "     \"modelInfo\": { " +
                "      \"modelType\": \"service\", " +
                "      \"modelInvariantId\": \"sn5256d1-5a33-55df-13ab-12abad84e764\", " +
                "      \"modelName\": \"WanBonding\", " +
                "      \"modelVersion\": \"1.0\" " +
                "     }, " +
                "     \"requestInfo\": { " +
                "      \"source\": \"VID\" " +
                "     } " +
                "    }, " +
                "    \"requestStatus\": { " +
                "     \"timestamp\": \"Thu, 30 Jun 2009 03:53:39 GMT\", " +
                "     \"requestState\": \"STAM STATE\", " +
                "     \"statusMessage\": \"MSO just had a bad day :-(\", " +
                "     \"percentProgress\": \"30\" " +
                "    } " +
                "   } " +
                "  }, { " +
                "   \"request\": { " +
                "    \"requestId\": \"08e4a296-2fac-49c9-8a29-90c7eeee5ac2\", " +
                "    \"startTime\": \"Thu, 30 Jun 2009 03:52:59 GMT\", " +
                "    \"instanceReferences\": { " +
                "     \"serviceInstanceId\": \"48962b01-f021-4f75-ad52-1d54b6ee0bdb\" " +
                "    }, " +
                "    \"requestScope\": \"vnf\", " +
                "    \"requestType\": \"applyUpdatedConfig\", " +
                "    \"requestDetails\": { " +
                "     \"modelInfo\": { " +
                "      \"modelType\": \"service\", " +
                "      \"modelInvariantId\": \"sn5256d1-5a33-55df-13ab-12abad84e764\", " +
                "      \"modelName\": \"WanBonding\", " +
                "      \"modelVersion\": \"1.0\" " +
                "     }, " +
                "     \"requestInfo\": { " +
                "      \"source\": \"VID\" " +
                "     } " +
                "    }, " +
                "    \"requestStatus\": { " +
                "     \"timestamp\": \"Thu, 30 Jun 2009 03:53:39 GMT\", " +
                "     \"requestState\": \"FAILED\", " +
                "     \"statusMessage\": \"\", " +
                "     \"percentProgress\": \"30\" " +
                "    } " +
                "   } " +
                "  } " +
                " ] " +
                "} ";
    }
}
