import json
import os
import urllib.request
import urllib.error

from odoo import http
from odoo.http import request


class HermesAIChatboxController(http.Controller):
    @http.route('/hermes_ai/chat', type='json', auth='user', methods=['POST'], csrf=True)
    def hermes_chat(self, message='', conversation_id=None, **kwargs):
        message = (message or '').strip()
        if not message:
            return {'ok': False, 'error': 'Vui lòng nhập câu hỏi.'}

        api_url = os.environ.get('HERMES_API_URL', '').strip()
        api_key = os.environ.get('HERMES_API_KEY', '').strip()
        if not api_url or not api_key:
            return {'ok': False, 'error': 'Hermes API chưa được cấu hình trên Odoo container.'}

        user = request.env.user
        system = (
            'Bạn là trợ lý Odoo read-only. Chỉ dùng dữ liệu do Odoo MCP trả về. '
            'Không tạo, sửa, xóa hoặc xác nhận dữ liệu. Nếu người dùng yêu cầu ghi dữ liệu, '
            'hãy nói rằng chatbox hiện chỉ hỗ trợ tra cứu. Trả lời ngắn gọn bằng tiếng Việt. '
            'User ID: %s; Company ID: %s.' % (user.id, user.company_id.id)
        )
        payload = {
            'model': 'hermes-agent',
            'messages': [
                {'role': 'system', 'content': system},
                {'role': 'user', 'content': message},
            ],
            'stream': False,
        }
        req = urllib.request.Request(
            api_url,
            data=json.dumps(payload).encode('utf-8'),
            headers={
                'Authorization': 'Bearer ' + api_key,
                'Content-Type': 'application/json',
            },
            method='POST',
        )
        try:
            with urllib.request.urlopen(req, timeout=120) as response:
                result = json.loads(response.read().decode('utf-8'))
            answer = result['choices'][0]['message']['content']
            return {'ok': True, 'message': answer, 'conversation_id': conversation_id}
        except (urllib.error.URLError, urllib.error.HTTPError, KeyError, ValueError) as exc:
            return {'ok': False, 'error': 'Không gọi được Hermes: %s' % exc}
