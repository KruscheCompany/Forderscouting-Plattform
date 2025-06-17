
# Deployment Status for **Förderscouting-Plattform**

This project, "Interkommunale Förderscouting-Plattform Nordfriesland," is a model initiative under the **Heimat 2.0** funding program of the **Federal Ministry for Housing, Urban Development, and Building (BMWSB)** in collaboration with the **Federal Institute for Building, Urban, and Spatial Research (BBSR)**.

## Deployment Info

### Development Environment
[![Dev Deployment](https://github.com/KruscheCompany/Forderscouting-Plattform/actions/workflows/dev.yml/badge.svg)](https://github.com/AlameenAzad/amt-viol/actions/workflows/dev.yml)

---

### Staging Environment
[![Stage Deployment](https://github.com/KruscheCompany/Forderscouting-Plattform/actions/workflows/stage.yml/badge.svg)](https://github.com/AlameenAzad/amt-viol/actions/workflows/stage.yml)

---

### Production Environment
[![Production Deployment](https://github.com/KruscheCompany/Forderscouting-Plattform/actions/workflows/stage.yml/badge.svg)](https://github.com/AlameenAzad/amt-viol/actions/workflows/stage.yml)

---

## Installation and Running the Application

This is a **Quasar Framework** application. Follow the steps below to set it up and run it locally:

### Prerequisites

1. **Node.js**: Ensure that you have Node.js installed (recommended version: 18+).
   Download it from [nodejs.org](https://nodejs.org/).
2. **Package Manager**:
   - `npm` (comes with Node.js) or
   - Install `yarn` if you prefer it:
     ```bash
     npm install -g yarn
     ```
3. **Quasar CLI**: Install the Quasar CLI globally:
   ```bash
   npm install -g @quasar/cli
   ```

---

### Steps to Install

1. Clone the repository:
   ```bash
   git clone https://github.com/AlameenAzad/amt-viol.git
   ```
2. Navigate into the project directory:
   ```bash
   cd amt-viol
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   Or, if you’re using `yarn`:
   ```bash
   yarn install
   ```

---

### Running the Application

#### Development Mode (Hot Reloading)
To start the app in development mode with live-reloading:
```bash
quasar dev
```

#### Build for Production
To build the app for production:
```bash
quasar build
```

#### Linting
To lint your code:
```bash
npm run lint
```
Or, if using `yarn`:
```bash
yarn lint
```

#### Testing the Build Locally
After building the app, you can preview it locally using the following:
```bash
npx http-server dist/spa
```
---
## Contributing

We welcome contributions! Please review our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to this project.
---

## Licensing

This project is licensed under the **GNU Affero General Public License v3.0 or later**.

```
2024 © Amt Viöl. All rights reserved.
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.
```

For more details, refer to the [GNU Affero General Public License](https://www.gnu.org/licenses/agpl-3.0.html).
