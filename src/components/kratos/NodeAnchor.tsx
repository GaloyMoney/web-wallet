import { UiNodeAnchorAttributes } from "@ory/kratos-client"
import { UiNode } from "@ory/kratos-client"
import { Button } from "@ory/themes"

interface Props {
  node: UiNode
  attributes: UiNodeAnchorAttributes
}

export const NodeAnchor = ({ node, attributes }: Props) => {
  return (
    <Button
      data-testid={`node/anchor/${attributes.id}`}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        event.preventDefault()
        window.location.href = attributes.href
      }}
    >
      {attributes.title.text}
    </Button>
  )
}
