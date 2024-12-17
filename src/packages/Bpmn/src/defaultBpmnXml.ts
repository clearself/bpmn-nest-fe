export default (key: string, name: string, type: string): string => {
  const initiator = 'currentUser'
  if (!type) type = 'camunda'
  const TYPE_TARGET = {
    activiti: 'http://activiti.org/bpmn',
    camunda: 'http://bpmn.io/schema/bpmn',
    flowable: 'http://flowable.org/bpmn'
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn2:definitions
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
    id="diagram_${key}"
    targetNamespace="${TYPE_TARGET[type]}">
  <bpmn2:process id="Process_${key}" name="${name}" isExecutable="true">
    <bpmn2:startEvent id="Event_178kjur" name="开始">
      <bpmn2:outgoing>Flow_0girvld</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:userTask id="Activity_108ybh5" name="发起人审批" camunda:assignee="${initiator}" camunda:candidateUsers="" camunda:candidateGroups="" dataType="INITIATOR" text="流程发起人">
      <bpmn2:incoming>Flow_0girvld</bpmn2:incoming>
      <bpmn2:outgoing>Flow_1ni5oq0</bpmn2:outgoing>
    </bpmn2:userTask>
    <bpmn2:sequenceFlow id="Flow_0girvld" sourceRef="Event_178kjur" targetRef="Activity_108ybh5" />
    <bpmn2:exclusiveGateway id="Gateway_0finfu0">
      <bpmn2:incoming>Flow_0s1ezcy</bpmn2:incoming>
      <bpmn2:outgoing>Flow_02rgowj</bpmn2:outgoing>
      <bpmn2:outgoing>Flow_0uf3b6k</bpmn2:outgoing>
    </bpmn2:exclusiveGateway>
    <bpmn2:sequenceFlow id="Flow_1ni5oq0" sourceRef="Activity_108ybh5" targetRef="Event_1fn5snq" />
    <bpmn2:userTask id="Activity_0skpz90" name="财务审批" camunda:candidateUsers="" camunda:candidateGroups="2" dataType="ROLES" text="">
      <bpmn2:incoming>Flow_02rgowj</bpmn2:incoming>
      <bpmn2:outgoing>Flow_08ruziy</bpmn2:outgoing>
    </bpmn2:userTask>
    <bpmn2:sequenceFlow id="Flow_02rgowj" name="money&#60;=500" sourceRef="Gateway_0finfu0" targetRef="Activity_0skpz90">
      <bpmn2:conditionExpression xsi:type="bpmn2:tFormalExpression">&lt;=500</bpmn2:conditionExpression>
    </bpmn2:sequenceFlow>
    <bpmn2:userTask id="Activity_1krg6rf" name="项目经理审批" camunda:candidateUsers="" camunda:candidateGroups="1" dataType="ROLES" text="">
      <bpmn2:incoming>Flow_0uf3b6k</bpmn2:incoming>
      <bpmn2:outgoing>Flow_086481q</bpmn2:outgoing>
    </bpmn2:userTask>
    <bpmn2:sequenceFlow id="Flow_0uf3b6k" name="money&#62;500" sourceRef="Gateway_0finfu0" targetRef="Activity_1krg6rf">
      <bpmn2:conditionExpression xsi:type="bpmn2:tFormalExpression">&gt;500</bpmn2:conditionExpression>
    </bpmn2:sequenceFlow>
    <bpmn2:endEvent id="Event_05xkxhs" name="结束">
      <bpmn2:incoming>Flow_08ruziy</bpmn2:incoming>
      <bpmn2:incoming>Flow_086481q</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="Flow_08ruziy" sourceRef="Activity_0skpz90" targetRef="Event_05xkxhs" />
    <bpmn2:sequenceFlow id="Flow_086481q" sourceRef="Activity_1krg6rf" targetRef="Event_05xkxhs" />
    <bpmn2:intermediateCatchEvent id="Event_1fn5snq" name="定时等待5分钟">
      <bpmn2:incoming>Flow_1ni5oq0</bpmn2:incoming>
      <bpmn2:outgoing>Flow_0s1ezcy</bpmn2:outgoing>
      <bpmn2:timerEventDefinition id="TimerEventDefinition_1n3lqzc">
        <bpmn2:timeDuration xsi:type="bpmn2:tFormalExpression">PT5M</bpmn2:timeDuration>
      </bpmn2:timerEventDefinition>
    </bpmn2:intermediateCatchEvent>
    <bpmn2:sequenceFlow id="Flow_0s1ezcy" sourceRef="Event_1fn5snq" targetRef="Gateway_0finfu0" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_${key}">
      <bpmndi:BPMNShape id="Event_178kjur_di" bpmnElement="Event_178kjur">
        <dc:Bounds x="182" y="232" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="189" y="275" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_108ybh5_di" bpmnElement="Activity_108ybh5">
        <dc:Bounds x="270" y="210" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_05xkxhs_di" bpmnElement="Event_05xkxhs">
        <dc:Bounds x="1022" y="232" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1029" y="275" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0skpz90_di" bpmnElement="Activity_0skpz90">
        <dc:Bounds x="720" y="210" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1krg6rf_di" bpmnElement="Activity_1krg6rf">
        <dc:Bounds x="720" y="370" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0finfu0_di" bpmnElement="Gateway_0finfu0" isMarkerVisible="true">
        <dc:Bounds x="555" y="225" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0qbuued_di" bpmnElement="Event_1fn5snq">
        <dc:Bounds x="442" y="232" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="425" y="275" width="72" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_0girvld_di" bpmnElement="Flow_0girvld">
        <di:waypoint x="218" y="250" />
        <di:waypoint x="270" y="250" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1ni5oq0_di" bpmnElement="Flow_1ni5oq0">
        <di:waypoint x="370" y="250" />
        <di:waypoint x="442" y="250" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_02rgowj_di" bpmnElement="Flow_02rgowj">
        <di:waypoint x="605" y="250" />
        <di:waypoint x="720" y="250" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="631" y="232" width="65" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0uf3b6k_di" bpmnElement="Flow_0uf3b6k">
        <di:waypoint x="580" y="275" />
        <di:waypoint x="580" y="410" />
        <di:waypoint x="720" y="410" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="510" y="375" width="59" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_08ruziy_di" bpmnElement="Flow_08ruziy">
        <di:waypoint x="820" y="250" />
        <di:waypoint x="1022" y="250" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_086481q_di" bpmnElement="Flow_086481q">
        <di:waypoint x="820" y="410" />
        <di:waypoint x="920" y="410" />
        <di:waypoint x="920" y="250" />
        <di:waypoint x="1022" y="250" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0s1ezcy_di" bpmnElement="Flow_0s1ezcy">
        <di:waypoint x="478" y="250" />
        <di:waypoint x="555" y="250" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>
`
}
