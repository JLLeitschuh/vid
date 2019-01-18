/*-
 * ============LICENSE_START=======================================================
 * VID
 * ================================================================================
 * Copyright © 2018 AT&T Intellectual Property. All rights reserved.
 * ================================================================================
 * Modifications Copyright 2019 Nokia
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

package org.onap.vid.controller;

import static org.springframework.http.HttpStatus.OK;

import org.onap.portalsdk.core.controller.UnRestrictedBaseController;
import org.onap.vid.services.RoleGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoleGeneratorController extends UnRestrictedBaseController {
    public static final String GENERATE_ROLE_SCRIPT = "generateRoleScript";
    private RoleGeneratorService roleGeneratorService;

    @Autowired
    public RoleGeneratorController(RoleGeneratorService roleGeneratorService) {
        this.roleGeneratorService = roleGeneratorService;
    }
    @RequestMapping(value =  GENERATE_ROLE_SCRIPT +"/{firstRun}", method = RequestMethod.GET )
    public ResponseEntity<String> generateRoleScript (@PathVariable("firstRun") boolean firstRun) {
        return ResponseEntity.status(OK).body(roleGeneratorService.generateRoleScript(firstRun));
    }
}
