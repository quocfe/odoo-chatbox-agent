# Odoo Chatbox Agent

A lightweight Odoo 15 backend chatbox that sends read-only questions to a Hermes Agent API. Hermes uses an Odoo MCP bridge to retrieve ERP data.

## Architecture

```text
Odoo chatbox → Odoo controller → Hermes API Server → Odoo MCP → Odoo XML-RPC
```

## Included module

`hermes_ai_chatbox/` adds an AI button in the bottom-right corner of the Odoo backend. The current version is read-only: it can answer questions but will not create, update, delete, or confirm Odoo records.

## Install

1. Copy `hermes_ai_chatbox` into the Odoo addons path.
2. Update the Apps List.
3. Install **Hermes AI Chatbox**.
4. Configure the Odoo container with:

```env
HERMES_API_URL=http://host.docker.internal:8642/v1/chat/completions
HERMES_API_KEY=replace-with-your-local-secret
```

5. Ensure the Hermes API Server is enabled and the Hermes Odoo MCP server is configured.
6. Restart Odoo and hard-refresh the browser.

## Security

- Keep `HERMES_API_KEY` outside Git.
- Use a dedicated Odoo integration user.
- Keep the MCP bridge read-only while testing.
- Do not enable write tools until preview, confirmation, ACLs, and audit logging are implemented.

## License

LGPL-3.0. The bundled chatbox module is local project code; review third-party MCP bridge licenses separately.
