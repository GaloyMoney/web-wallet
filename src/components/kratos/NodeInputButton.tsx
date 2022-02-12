import { getNodeLabel } from "@ory/integrations/ui"
import { UiNode, UiNodeInputAttributes } from "@ory/kratos-client"
import { Button, Checkbox, TextInput } from "@ory/themes"

import { FormDispatcher, NodeInputProps, ValueSetter } from "./helpers"

export const NodeInputButton = ({
  node,
  attributes,
  setValue,
  disabled,
  dispatchSubmit,
}: NodeInputProps) => {
  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.
  const onClick = () => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    if (attributes.onclick) {
      const run = new Function(attributes.onclick)
      run()
    }
  }

  return (
    <>
      <Button
        name={attributes.name}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          onClick()
          setValue(attributes.value).then(() => dispatchSubmit(event))
        }}
        value={attributes.value || ""}
        disabled={attributes.disabled || disabled}
      >
        {getNodeLabel(node)}
      </Button>
    </>
  )
}
