import { Configuration, V0alpha2Api } from "@ory/client"
import { V0alpha2ApiInterface } from "@ory/kratos-client"

const kratosEndpoint = process.env.KRATOS_ENDPOINT

const kratos: V0alpha2ApiInterface = new V0alpha2Api(
  new Configuration({ basePath: kratosEndpoint }),
) as unknown as V0alpha2ApiInterface
