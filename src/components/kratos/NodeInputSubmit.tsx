import { getNodeLabel } from "@ory/integrations/ui"
import { Button } from "@ory/themes"
import { NodeInputProps } from "./helpers"

export const NodeInputSubmit = ({
  node,
  attributes,
  setValue,
  disabled,
  dispatchSubmit,
}: NodeInputProps) => {
  return (
    <>
      <Button
        name={attributes.name}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          // On click, we set this value, and once set, dispatch the submission!
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
