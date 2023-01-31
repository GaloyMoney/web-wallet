import { publicConfig } from "@/store"
import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<typeof publicConfig>,
) {
  console.log({ publicConfig })

  res.status(200).json(publicConfig)
}
