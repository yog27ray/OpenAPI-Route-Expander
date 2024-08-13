# OpenAPI Ref Resolver

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
[![codecov](https://codecov.io/gh/yog27ray/OpenAPI-RouteExpander/graph/badge.svg?token=G6S09CMOIT)](https://codecov.io/gh/yog27ray/OpenAPI-RouteExpander)

A TypeScript utility for resolving `$ref` in OpenAPI YAML routes, generating new YAML files without `$ref`, ready for OpenAPI processing.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Features

- **$ref Resolution**: Automatically resolves `$ref` within OpenAPI YAML routes.
- **YAML Processing**: Reads and writes YAML files seamlessly.
- **TypeScript Support**: Fully typed and written in TypeScript.
- **Easy Integration**: Simple API for integrating into existing projects.

## Installation

You can install the package using npm:

```bash
npm install openapi-ref-resolver
```
Or with yarn:
```bash
yarn add openapi-ref-resolver
```

## Usage

Here’s an example of how to use the resolveRefsInRoutes function:
```javascript
import { resolveRefsInRoutes } from 'openapi-ref-resolver';

const inputFilePath = '/absolute/path/to/your/input.yaml';
const outputFilePath = '/absolute/path/to/your/output.yaml';

resolveRefsInRoutes(inputFilePath, outputFilePath);

```
