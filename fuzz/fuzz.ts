import fs from "fs"

function getRandomValue(value: unknown): unknown {
  const val_type = typeof value
  switch (val_type) {
    case "number":
      return Math.round(Math.random() * 100) // Random number in range [-50, 50]
    case "string":
      return Math.random().toString(36).substring(7)
    case "boolean":
      return Math.random() < 0.5
    case "object":
      if (Array.isArray(value)) {
        return value.map(getRandomValue)
      } else if (value instanceof Date) {
        return new Date(Math.random() * 10 + Date.now())
      } else {
        return Object.entries(value as object)?.map(([key, val]) => [
          key,
          getRandomValue(val),
        ])
      }
    default:
      return value
  }
}

export function fuzz<T>(props: {
  defaultParams: T
  func: (params: T) => unknown
  numTests?: number
  logFile?: string
}): void {
  const numTests = props.numTests ?? 1000
  const errorLogFile = props.logFile ?? "fuzz_errors.log"

  for (let i = 0; i < numTests; i++) {
    console.log(`FUZZ TEST # ${i}`)

    // construct the object randomly
    const testParams = getRandomValue(props.defaultParams) as T

    console.log("testParams: ", testParams)

    try {
      props.func(testParams)
    } catch (e) {
      const errorMessage = [
        "------------------------------------------------",
        `TEST #${i + 1}`,
        "------------------------------------------------",
        `Failed with input:`,
        JSON.stringify(testParams),
        `Error: ${e}\n\n`,
      ].join("\n")

      fs.appendFileSync(errorLogFile, errorMessage)
    }
  }
}
