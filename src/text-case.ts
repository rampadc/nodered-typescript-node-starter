import {Red, Node, NodeProperties} from "node-red";

interface TextCasingNodeConfig extends NodeProperties {
  style: string
}

function TextCaseNode(RED: Red) {
  function TextCase(this: Node, config: TextCasingNodeConfig) {
    RED.nodes.createNode(this, config);

    this.on('input', (msg: any) => {
      let msgPayload = msg.payload as string;

      switch (config.style.toLowerCase()) {
        case 'uppercase':
          msgPayload = msgPayload.toUpperCase();
          break;
        case 'lowercase':
          msgPayload = msgPayload.toLowerCase();
          break;
        case 'capitalize':
          msgPayload = msgPayload.toLowerCase();
          msgPayload = msgPayload.charAt(0).toUpperCase() + msgPayload.slice(1);
          break;
        default:
          break;
      }

      this.send({
        payload: msgPayload
      })
    });
  }
  RED.nodes.registerType('text-case', TextCase);
}

export = function (RED: Red) {
  TextCaseNode(RED);
}