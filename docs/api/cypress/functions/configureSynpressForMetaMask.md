# Function: configureSynpressForMetaMask()

```ts
function configureSynpressForMetaMask(
   on, 
   config, 
   importDefaultWallet?): {
  "animationDistanceThreshold": number;
  "arch": string;
  "autoOpen": boolean;
  "baseUrl": string | null;
  "blockHosts": string | string[] | null;
  "browser": Cypress.Browser;
  "browserUrl": string;
  "browsers": Cypress.Browser[];
  "chromeWebSecurity": boolean;
  "clientCertificates": Cypress.ClientCertificate[];
  "clientRoute": string;
  "component": Cypress.ComponentConfigOptions<any>;
  "configFile": string;
  "cypressBinaryRoot": string;
  "cypressEnv": string;
  "defaultCommandTimeout": number;
  "devServerPublicPathRoute": string;
  "downloadsFolder": string;
  "e2e": Cypress.EndToEndConfigOptions;
  "env": {};
  "excludeSpecPattern": string | string[];
  "execTimeout": number;
  "experimentalCspAllowList": boolean | Cypress.experimentalCspAllowedDirectives[];
  "experimentalFetchPolyfill": boolean;
  "experimentalInteractiveRunEvents": boolean;
  "experimentalMemoryManagement": boolean;
  "experimentalModifyObstructiveThirdPartyCode": boolean;
  "experimentalSkipDomainInjection": string[] | null;
  "experimentalSourceRewriting": boolean;
  "experimentalStudio": boolean;
  "experimentalWebKitSupport": boolean;
  "fileServerFolder": string;
  "fixturesFolder": string | false;
  "hideCommandLog": boolean;
  "hideRunnerUi": boolean;
  "hosts": {} | null;
  "includeShadowDom": boolean;
  "indexHtmlFile": string;
  "isInteractive": boolean;
  "isNewProject": boolean;
  "isTextTerminal": boolean;
  "modifyObstructiveCode": boolean;
  "morgan": boolean;
  "namespace": string;
  "numTestsKeptInMemory": number;
  "pageLoadTimeout": number;
  "parentTestsFolder": string;
  "parentTestsFolderDisplay": string;
  "platform": "darwin" | "linux" | "win32";
  "port": number | null;
  "projectId": string | null;
  "projectName": string;
  "projectRoot": string;
  "protocolEnabled": boolean;
  "proxyUrl": string;
  "redirectionLimit": number;
  "remote": Cypress.RemoteState;
  "repoRoot": string | null;
  "report": boolean;
  "reporter": string;
  "reporterOptions": {};
  "reporterRoute": string;
  "reporterUrl": string;
  "requestTimeout": number;
  "resolvedNodePath": string;
  "resolvedNodeVersion": string;
  "responseTimeout": number;
  "retries": Cypress.Nullable<number | {
     "openMode": Cypress.Nullable<number>;
     "runMode": Cypress.Nullable<number>;
    } | Cypress.RetryStrategyWithModeSpecs>;
  "screenshotOnRunFailure": boolean;
  "screenshotsFolder": string | false;
  "scrollBehavior": Cypress.scrollBehaviorOptions;
  "setupNodeEvents": (on, config) => void | Cypress.PluginConfigOptions | Promise<void | Cypress.PluginConfigOptions>;
  "slowTestThreshold": number;
  "socketId": string | null;
  "socketIoCookie": string;
  "socketIoRoute": string;
  "spec": Cypress.Spec | null;
  "specPattern": string | string[];
  "specs": Cypress.Spec[];
  "supportFile": string | false;
  "supportFolder": string;
  "taskTimeout": number;
  "testIsolation": boolean;
  "testingType": Cypress.TestingType;
  "trashAssetsBeforeRuns": boolean;
  "userAgent": string | null;
  "version": string;
  "video": boolean;
  "videoCompression": number | boolean;
  "videosFolder": string;
  "viewportHeight": number;
  "viewportWidth": number;
  "waitForAnimations": boolean;
  "watchForFileChanges": boolean;
}
```

Configures Synpress for use with MetaMask.

This function sets up the necessary configurations and hooks for running
Cypress tests with MetaMask.

## Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `on` | `PluginEvents` | Cypress plugin event handler |
| `config` | `PluginConfigOptions` | Cypress plugin configuration options |
| `importDefaultWallet`? | `boolean` | Whether to import the default wallet |

## Returns

```ts
{
  "animationDistanceThreshold": number;
  "arch": string;
  "autoOpen": boolean;
  "baseUrl": string | null;
  "blockHosts": string | string[] | null;
  "browser": Cypress.Browser;
  "browserUrl": string;
  "browsers": Cypress.Browser[];
  "chromeWebSecurity": boolean;
  "clientCertificates": Cypress.ClientCertificate[];
  "clientRoute": string;
  "component": Cypress.ComponentConfigOptions<any>;
  "configFile": string;
  "cypressBinaryRoot": string;
  "cypressEnv": string;
  "defaultCommandTimeout": number;
  "devServerPublicPathRoute": string;
  "downloadsFolder": string;
  "e2e": Cypress.EndToEndConfigOptions;
  "env": {};
  "excludeSpecPattern": string | string[];
  "execTimeout": number;
  "experimentalCspAllowList": boolean | Cypress.experimentalCspAllowedDirectives[];
  "experimentalFetchPolyfill": boolean;
  "experimentalInteractiveRunEvents": boolean;
  "experimentalMemoryManagement": boolean;
  "experimentalModifyObstructiveThirdPartyCode": boolean;
  "experimentalSkipDomainInjection": string[] | null;
  "experimentalSourceRewriting": boolean;
  "experimentalStudio": boolean;
  "experimentalWebKitSupport": boolean;
  "fileServerFolder": string;
  "fixturesFolder": string | false;
  "hideCommandLog": boolean;
  "hideRunnerUi": boolean;
  "hosts": {} | null;
  "includeShadowDom": boolean;
  "indexHtmlFile": string;
  "isInteractive": boolean;
  "isNewProject": boolean;
  "isTextTerminal": boolean;
  "modifyObstructiveCode": boolean;
  "morgan": boolean;
  "namespace": string;
  "numTestsKeptInMemory": number;
  "pageLoadTimeout": number;
  "parentTestsFolder": string;
  "parentTestsFolderDisplay": string;
  "platform": "darwin" | "linux" | "win32";
  "port": number | null;
  "projectId": string | null;
  "projectName": string;
  "projectRoot": string;
  "protocolEnabled": boolean;
  "proxyUrl": string;
  "redirectionLimit": number;
  "remote": Cypress.RemoteState;
  "repoRoot": string | null;
  "report": boolean;
  "reporter": string;
  "reporterOptions": {};
  "reporterRoute": string;
  "reporterUrl": string;
  "requestTimeout": number;
  "resolvedNodePath": string;
  "resolvedNodeVersion": string;
  "responseTimeout": number;
  "retries": Cypress.Nullable<number | {
     "openMode": Cypress.Nullable<number>;
     "runMode": Cypress.Nullable<number>;
    } | Cypress.RetryStrategyWithModeSpecs>;
  "screenshotOnRunFailure": boolean;
  "screenshotsFolder": string | false;
  "scrollBehavior": Cypress.scrollBehaviorOptions;
  "setupNodeEvents": (on, config) => void | Cypress.PluginConfigOptions | Promise<void | Cypress.PluginConfigOptions>;
  "slowTestThreshold": number;
  "socketId": string | null;
  "socketIoCookie": string;
  "socketIoRoute": string;
  "spec": Cypress.Spec | null;
  "specPattern": string | string[];
  "specs": Cypress.Spec[];
  "supportFile": string | false;
  "supportFolder": string;
  "taskTimeout": number;
  "testIsolation": boolean;
  "testingType": Cypress.TestingType;
  "trashAssetsBeforeRuns": boolean;
  "userAgent": string | null;
  "version": string;
  "video": boolean;
  "videoCompression": number | boolean;
  "videosFolder": string;
  "viewportHeight": number;
  "viewportWidth": number;
  "waitForAnimations": boolean;
  "watchForFileChanges": boolean;
}
```

Modified Cypress configuration

| Member | Type |
| :------ | :------ |
| `animationDistanceThreshold` | `number` |
| `arch` | `string` |
| `autoOpen` | `boolean` |
| `baseUrl` | `string` \| `null` |
| `blockHosts` | `string` \| `string`[] \| `null` |
| `browser` | `Cypress.Browser` |
| `browserUrl` | `string` |
| `browsers` | `Cypress.Browser`[] |
| `chromeWebSecurity` | `boolean` |
| `clientCertificates` | `Cypress.ClientCertificate`[] |
| `clientRoute` | `string` |
| `component` | `Cypress.ComponentConfigOptions`\<`any`\> |
| `configFile` | `string` |
| `cypressBinaryRoot` | `string` |
| `cypressEnv` | `string` |
| `defaultCommandTimeout` | `number` |
| `devServerPublicPathRoute` | `string` |
| `downloadsFolder` | `string` |
| `e2e` | `Cypress.EndToEndConfigOptions` |
| `env` | \{\} |
| `excludeSpecPattern` | `string` \| `string`[] |
| `execTimeout` | `number` |
| `experimentalCspAllowList` | `boolean` \| `Cypress.experimentalCspAllowedDirectives`[] |
| `experimentalFetchPolyfill` | `boolean` |
| `experimentalInteractiveRunEvents` | `boolean` |
| `experimentalMemoryManagement` | `boolean` |
| `experimentalModifyObstructiveThirdPartyCode` | `boolean` |
| `experimentalSkipDomainInjection` | `string`[] \| `null` |
| `experimentalSourceRewriting` | `boolean` |
| `experimentalStudio` | `boolean` |
| `experimentalWebKitSupport` | `boolean` |
| `fileServerFolder` | `string` |
| `fixturesFolder` | `string` \| `false` |
| `hideCommandLog` | `boolean` |
| `hideRunnerUi` | `boolean` |
| `hosts` | \{\} \| `null` |
| `includeShadowDom` | `boolean` |
| `indexHtmlFile` | `string` |
| `isInteractive` | `boolean` |
| `isNewProject` | `boolean` |
| `isTextTerminal` | `boolean` |
| `modifyObstructiveCode` | `boolean` |
| `morgan` | `boolean` |
| `namespace` | `string` |
| `numTestsKeptInMemory` | `number` |
| `pageLoadTimeout` | `number` |
| `parentTestsFolder` | `string` |
| `parentTestsFolderDisplay` | `string` |
| `platform` | `"darwin"` \| `"linux"` \| `"win32"` |
| `port` | `number` \| `null` |
| `projectId` | `string` \| `null` |
| `projectName` | `string` |
| `projectRoot` | `string` |
| `protocolEnabled` | `boolean` |
| `proxyUrl` | `string` |
| `redirectionLimit` | `number` |
| `remote` | `Cypress.RemoteState` |
| `repoRoot` | `string` \| `null` |
| `report` | `boolean` |
| `reporter` | `string` |
| `reporterOptions` | \{\} |
| `reporterRoute` | `string` |
| `reporterUrl` | `string` |
| `requestTimeout` | `number` |
| `resolvedNodePath` | `string` |
| `resolvedNodeVersion` | `string` |
| `responseTimeout` | `number` |
| `retries` | `Cypress.Nullable`\<`number` \| \{
  `"openMode"`: `Cypress.Nullable`\<`number`\>;
  `"runMode"`: `Cypress.Nullable`\<`number`\>;
 \} \| `Cypress.RetryStrategyWithModeSpecs`\> |
| `screenshotOnRunFailure` | `boolean` |
| `screenshotsFolder` | `string` \| `false` |
| `scrollBehavior` | `Cypress.scrollBehaviorOptions` |
| `setupNodeEvents` | (`on`, `config`) => `void` \| `Cypress.PluginConfigOptions` \| `Promise`\<`void` \| `Cypress.PluginConfigOptions`\> |
| `slowTestThreshold` | `number` |
| `socketId` | `string` \| `null` |
| `socketIoCookie` | `string` |
| `socketIoRoute` | `string` |
| `spec` | `Cypress.Spec` \| `null` |
| `specPattern` | `string` \| `string`[] |
| `specs` | `Cypress.Spec`[] |
| `supportFile` | `string` \| `false` |
| `supportFolder` | `string` |
| `taskTimeout` | `number` |
| `testIsolation` | `boolean` |
| `testingType` | `Cypress.TestingType` |
| `trashAssetsBeforeRuns` | `boolean` |
| `userAgent` | `string` \| `null` |
| `version` | `string` |
| `video` | `boolean` |
| `videoCompression` | `number` \| `boolean` |
| `videosFolder` | `string` |
| `viewportHeight` | `number` |
| `viewportWidth` | `number` |
| `waitForAnimations` | `boolean` |
| `watchForFileChanges` | `boolean` |

## Throws

Error If no Chrome browser is found in the configuration

## Remarks

This function performs the following tasks:

1. Filters the available browsers to ensure only Chrome is used.
2. Sets up a 'before:browser:launch' hook to enable debug mode, establish
   a Playwright connection, and initialize MetaMask.
3. Sets up a 'before:spec' hook to import the MetaMask wallet before
   each test spec runs.
4. Provides task handlers for various MetaMask-related operations.

## Example

```typescript
import { configureSynpress } from './configureSynpress';

export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  return configureSynpress(on, config);
};
```
