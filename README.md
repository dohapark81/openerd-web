# OpenERD Web

OpenERD is a web-based database design tool. Use this tool to design your databases. 
OpenERD serves as a tool that automates REST API creation using AI based on the designed schema information. 
While not yet implemented, it will provide functionality to generate REST API source code directly from your ERD designs.

## Prerequisites

- Node.js (>= 20.x)
- npm (>= 10.x)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dohapark81/openerd-web.git
   cd openerd-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Available Scripts

- **Development Server:**
  ```bash
  npm run dev
  ```

- **Production Build:**
  ```bash
  npm run build
  ```

- **Lint Check:**
  ```bash
  npm run lint
  ```

## Project Structure

- `src/pages`: Source code page directory
- `src/components`: Source code components directory
- `public/`: Public assets directory
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite configuration

## License

OpenERD is licensed under the [GNU Affero General Public License v3.0](LICENSE)