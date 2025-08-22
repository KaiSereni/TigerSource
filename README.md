# TigerSource
This is an open-source repository designed to help RIT students find the resources they need for a given task, as well as to look for clubs. Tigersource has no affiliation with RIT.

## Quickstart
Get a Google Gemini API key, create a `apphosting.emulator.yaml` file in the `/functions` directory, and set the property as specified below.<br>
### Example apphosting.emulator.yaml:
```
runConfig:
  cpu: 1
  memoryMiB: 1024
env:
  - variable: GEMINI_API_KEY
    value: [GEMINI KEY GOES HERE]
```
To get started, run `npm i` followed by `npm run emulate`.

## Note:
More RIT apps should be open-source so RIT computer science or UI/UX students can fork them and learn from them. I know some use external services like Starfish or Symplicity, but the mobile app and CampusGroups, for example, could have open source code. 