{
    'name': 'Hermes AI Chatbox',
    'version': '15.0.1.0.3',
    'category': 'Tools',
    'summary': 'Read-only Odoo assistant powered by Hermes Agent',
    'author': 'Local',
    'license': 'LGPL-3',
    'depends': ['web'],
    'assets': {
        'web.assets_backend': [
            'hermes_ai_chatbox/static/src/css/chatbox.css',
            'hermes_ai_chatbox/static/src/js/chatbox.js',
        ],
    },
    'installable': True,
    'application': False,
}
