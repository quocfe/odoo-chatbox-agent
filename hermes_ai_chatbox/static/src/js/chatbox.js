odoo.define('hermes_ai_chatbox.Chatbox', function (require) {
    'use strict';

    var Widget = require('web.Widget');
    var ajax = require('web.ajax');

    var Chatbox = Widget.extend({
        className: 'o_hermes_root',
        events: {
            'click .o_hermes_toggle': '_toggle',
            'click .o_hermes_close': '_close',
            'click .o_hermes_send': '_send',
            'keydown .o_hermes_input': '_keydown',
        },
        start: function () {
            var self = this;
            this.$el.html(
                '<button class="o_hermes_toggle" title="Hermes AI">AI</button>' +
                '<div class="o_hermes_panel o_hermes_hidden">' +
                '<div class="o_hermes_header"><b>Hermes AI · Odoo</b><button class="o_hermes_close">×</button></div>' +
                '<div class="o_hermes_messages"><div class="o_hermes_message o_hermes_bot">Xin chào! Em chỉ tra cứu dữ liệu Odoo, chưa thực hiện thay đổi.</div></div>' +
                '<div class="o_hermes_composer"><textarea class="o_hermes_input" rows="2" placeholder="Hỏi về đơn hàng, tồn kho, hóa đơn..."></textarea><button class="o_hermes_send">Gửi</button></div>' +
                '</div>'
            );
            this.$panel = this.$('.o_hermes_panel');
            this.$messages = this.$('.o_hermes_messages');
            this.$input = this.$('.o_hermes_input');
            return this._super.apply(this, arguments);
        },
        _toggle: function () {
            this.$panel.toggleClass('o_hermes_hidden');
            if (!this.$panel.hasClass('o_hermes_hidden')) this.$input.focus();
        },
        _close: function () { this.$panel.addClass('o_hermes_hidden'); },
        _keydown: function (ev) {
            if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); this._send(); }
        },
        _append: function (text, cls) {
            var node = $('<div/>', {class: 'o_hermes_message ' + cls}).text(text);
            this.$messages.append(node);
            this.$messages.scrollTop(this.$messages[0].scrollHeight);
        },
        _send: function () {
            var self = this;
            var text = (this.$input.val() || '').trim();
            if (!text) return;
            this.$input.val('');
            this._append(text, 'o_hermes_user');
            this.$('.o_hermes_send').prop('disabled', true);
            this._append('Đang tra cứu Odoo...', 'o_hermes_pending');
            ajax.jsonRpc('/hermes_ai/chat', 'call', {message: text}, {shadow: true}).then(function (res) {
                self.$('.o_hermes_pending').last().remove();
                self._append(res.ok ? res.message : res.error, res.ok ? 'o_hermes_bot' : 'o_hermes_error');
            }).guardedCatch(function () {
                self.$('.o_hermes_pending').last().remove();
                self._append('Lỗi kết nối chatbox.', 'o_hermes_error');
            }).then(function () {
                self.$('.o_hermes_send').prop('disabled', false);
            }, function () {
                self.$('.o_hermes_send').prop('disabled', false);
            });
        },
    });

    var core = require('web.core');
    core.bus.on('web_client_ready', null, function () {
        new Chatbox(null).appendTo(document.body);
    });
});
