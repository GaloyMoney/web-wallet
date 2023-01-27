import { config, publicConfig } from "./config"

describe("config", () => {
  it("has isBrowser", () => {
    expect(config.isBrowser).toBe(true)
  })
})

describe("publicConfig", () => {
  it("does not included all config", () => {
    expect(publicConfig.isBrowser).toBe(undefined)
  })
})
