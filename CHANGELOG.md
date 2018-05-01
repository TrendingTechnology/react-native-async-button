<a name="4.0.1"></a>
## [4.0.1](https://github.com/ef-carbon/react-native-async-button/compare/v4.0.0...v4.0.1) (2018-05-01)


### Bug Fixes

* fix component flows for success and failure ([2c52017](https://github.com/ef-carbon/react-native-async-button/commit/2c52017))

<a name="4.0.0"></a>
# [4.0.0](https://github.com/ef-carbon/react-native-async-button/compare/v3.1.0...v4.0.0) (2018-04-21)


### Code Refactoring

* remove sub-prop interfaces ([83ed258](https://github.com/ef-carbon/react-native-async-button/commit/83ed258))


### Features

* **async-button:** component state available to render callbacks ([917db06](https://github.com/ef-carbon/react-native-async-button/commit/917db06))
* **async-button:** respond to taps with `TouchableOpacity` ([1874d57](https://github.com/ef-carbon/react-native-async-button/commit/1874d57))


### BREAKING CHANGES

* sub-property interfaces are no-longer exported, use the new TypeScript mapping types and older `Pick`

<a name="3.1.0"></a>
# [3.1.0](https://github.com/ef-carbon/react-native-async-button/compare/v3.0.1...v3.1.0) (2018-04-20)


### Features

* **component:** support for disabled component ([64d6bb1](https://github.com/ef-carbon/react-native-async-button/commit/64d6bb1))

<a name="3.0.1"></a>
## [3.0.1](https://github.com/ef-carbon/react-native-async-button/compare/v3.0.0...v3.0.1) (2018-03-26)


### Bug Fixes

* correct the exports ([d3f27b8](https://github.com/ef-carbon/react-native-async-button/commit/d3f27b8))
* correct the static types ([2898b6f](https://github.com/ef-carbon/react-native-async-button/commit/2898b6f))
* correctly retrieve the static property ([57d21d5](https://github.com/ef-carbon/react-native-async-button/commit/57d21d5))

<a name="3.0.0"></a>
# [3.0.0](https://github.com/ef-carbon/react-native-async-button/compare/v2.2.1...v3.0.0) (2018-03-22)


### Bug Fixes

* **async-button:** correct the static activity indicator property name ([c3b511e](https://github.com/ef-carbon/react-native-async-button/commit/c3b511e))


### BREAKING CHANGES

* **async-button:** `AsyncButton.ActivityIndicator` is now `AsyncButton.ProcessingCompoent` to mirror the instance property name. This provides much better nomenclature consistency

<a name="2.2.1"></a>
## [2.2.1](https://github.com/ef-carbon/react-native-async-button/compare/v2.2.0...v2.2.1) (2018-03-22)


### Bug Fixes

* **async-button:** default `ActivityIndicator` property more flexible ([37d23d5](https://github.com/ef-carbon/react-native-async-button/commit/37d23d5))

<a name="2.2.0"></a>
# [2.2.0](https://github.com/ef-carbon/react-native-async-button/compare/v2.1.3...v2.2.0) (2018-03-22)


### Features

* **async-button:** add static `ActivityIndicator` property ([cc924bb](https://github.com/ef-carbon/react-native-async-button/commit/cc924bb))

<a name="2.1.3"></a>
## [2.1.3](https://github.com/ef-carbon/react-native-async-button/compare/v2.1.2...v2.1.3) (2018-03-20)


### Bug Fixes

* **package:** allow any peer version of react and react-native ([12d5561](https://github.com/ef-carbon/react-native-async-button/commit/12d5561))

<a name="2.1.2"></a>
## [2.1.2](https://github.com/ef-carbon/react-native-async-button/compare/v2.1.1...v2.1.2) (2018-02-20)


### Bug Fixes

* **button:** make components pure ([ce76fd4](https://github.com/ef-carbon/react-native-async-button/commit/ce76fd4))

<a name="2.1.1"></a>
## [2.1.1](https://github.com/ef-carbon/react-native-async-button/compare/v2.1.0...v2.1.1) (2018-02-16)


### Bug Fixes

* **build:** use `£ef-carbon/react-render-component` ([14f5813](https://github.com/ef-carbon/react-native-async-button/commit/14f5813))

<a name="2.1.0"></a>
# [2.1.0](https://github.com/ef-carbon/react-native-async-button/compare/v2.0.2...v2.1.0) (2018-02-15)


### Features

* **context-button:** implement a context async button ([84f89d7](https://github.com/ef-carbon/react-native-async-button/commit/84f89d7))

<a name="2.0.2"></a>
## [2.0.2](https://github.com/ef-carbon/react-native-async-button/compare/v2.0.1...v2.0.2) (2018-02-15)


### Bug Fixes

* **button:** better handle synchronous resets ([4eb7dd1](https://github.com/ef-carbon/react-native-async-button/commit/4eb7dd1))

<a name="2.0.1"></a>
## [2.0.1](https://github.com/ef-carbon/react-native-async-button/compare/v2.0.0...v2.0.1) (2018-02-15)


### Bug Fixes

* **build:** correctly convert rolled up JSX ([7407eac](https://github.com/ef-carbon/react-native-async-button/commit/7407eac))

<a name="2.0.0"></a>
# [2.0.0](https://github.com/ef-carbon/react-native-async-button/compare/v1.0.1...v2.0.0) (2018-02-15)


### Code Refactoring

* **component:** rename `Error` to `Failure` ([d894a53](https://github.com/ef-carbon/react-native-async-button/commit/d894a53))


### BREAKING CHANGES

* **component:** the `ErrorComponent` property has changed to `FailureComponent` and the `onError` callback has changed to `onFailure`. This was done to correct make the nomenclature consistent.

<a name="1.0.1"></a>
## [1.0.1](https://github.com/ef-carbon/react-native-async-button/compare/v1.0.0...v1.0.1) (2018-02-15)


### Bug Fixes

* **build:** only run Jest `__snapshot__` replace locally ([afddb1f](https://github.com/ef-carbon/react-native-async-button/commit/afddb1f))

<a name="1.0.0"></a>
# 1.0.0 (2018-02-14)


### Features

* async button component ([bcea2a7](https://github.com/ef-carbon/react-native-async-button/commit/bcea2a7))
