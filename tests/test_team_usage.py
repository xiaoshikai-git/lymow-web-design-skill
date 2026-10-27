import argparse
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

script = Path(__file__).resolve().parents[1] / 'skills/lymow-web-design/scripts/team_usage.py'
spec = importlib.util.spec_from_file_location('team_usage', script)
usage = importlib.util.module_from_spec(spec)
spec.loader.exec_module(usage)


class UsageTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.env = patch.dict(os.environ, {'LYMOW_USAGE_HOME': self.tmp.name})
        self.env.start()
        self.cfg = {'enabled': True, 'person': 'TEST-user', 'registration_id': 'random-test-registration',
                    'webhook': 'https://example.feishu.cn/base/automation/webhook/event/test', 'token': 'TEST-secret'}
        usage.save_config(self.cfg)

    def tearDown(self):
        self.env.stop()
        self.tmp.cleanup()

    def test_one_install_and_two_distinct_runs(self):
        with patch.object(usage, 'post_event') as send:
            for _ in range(2):
                usage.event(self.cfg, 'install', 'first-enrollment', 'codex')
            for key in ['task-a', 'task-a', 'task-b']:
                usage.event(self.cfg, 'run', key, 'codex')
            self.assertEqual(send.call_count, 3)
            self.assertEqual([x.args[1]['event'] for x in send.call_args_list], ['install','run','run'])
            payload = send.call_args.args[1]
            self.assertEqual(set(payload), {'event_id','person','event','occurred_at','week','count','skill','skill_version','agent'})
            self.assertNotIn('task-b', json.dumps(payload))
            self.assertNotIn('TEST-secret', json.dumps(payload))

    def test_failure_is_retried_with_same_id_and_timestamp(self):
        with patch.object(usage, 'post_event', side_effect=OSError('do not expose private URL')):
            usage.event(self.cfg, 'run', 'offline-task', 'codex')
        with usage.database() as db:
            pending = json.loads(db.execute('SELECT payload FROM events').fetchone()[0])
        with patch.object(usage, 'post_event') as send:
            with usage.database() as db:
                self.assertEqual(usage.flush(self.cfg, db), 1)
            self.assertEqual(send.call_args.args[1], pending)

    def test_default_and_disabled_never_send_or_create_events(self):
        for cfg in [{}, {**self.cfg, 'enabled':False}]:
            usage.save_config(cfg)
            with patch.object(usage, 'post_event') as send, patch.object(os, 'argv', create=True):
                with patch('sys.argv', ['team_usage.py','record','--task-id','test-task']):
                    usage.main()
                send.assert_not_called()
        self.assertFalse((Path(self.tmp.name) / 'events.sqlite3').exists())

    def test_destination_validation(self):
        usage.validate_url(self.cfg['webhook'])
        for url in ['http://example.feishu.cn/base/automation/webhook/event/a',
                    'https://feishu.cn.evil.test/base/automation/webhook/event/a',
                    'https://open.feishu.cn/open-apis/bot/v2/hook/a',
                    'https://user:pass@example.feishu.cn/base/automation/webhook/event/a']:
            with self.assertRaises(ValueError):
                usage.validate_url(url)

    def test_anonymous_identity_persists_and_distinguishes_installations(self):
        args = argparse.Namespace(person=None, consent=True, agent='codex', receiver_file=None)
        with patch.dict(os.environ, {'LYMOW_FEISHU_WEBHOOK':self.cfg['webhook'], 'LYMOW_FEISHU_TOKEN':'test'}), patch.object(usage.sys.stdin, 'isatty', return_value=False), patch.object(usage, 'post_event') as send:
            usage.save_config({})
            usage.setup(args)
            first = usage.config()
            usage.setup(args)
            self.assertEqual(usage.config()['person'], first['person'])
            self.assertEqual(send.call_count, 1)
            for task in ['need-a', 'need-b', 'need-b']:
                usage.event(usage.config(), 'run', task, 'codex')
            self.assertEqual(send.call_count, 3)
            self.assertTrue(all(c.args[1]['person'] == first['person'] for c in send.call_args_list))
            self.assertRegex(first['person'], r'^同事-[0-9a-f]{16}$')
            with tempfile.TemporaryDirectory() as second_home, patch.dict(os.environ, {'LYMOW_USAGE_HOME':second_home}):
                usage.setup(args)
                self.assertNotEqual(usage.config()['person'], first['person'])

    def test_receiver_file_named_setup_and_no_consent(self):
        receiver = Path(self.tmp.name) / 'receiver.json'
        receiver.write_text(json.dumps({'webhook':self.cfg['webhook'], 'token':'test'}))
        args = argparse.Namespace(person='Explicit-name', consent=False, agent='codex', receiver_file=str(receiver))
        usage.save_config({})
        with patch.object(usage.sys.stdin, 'isatty', return_value=False), patch.object(usage, 'post_event') as send:
            usage.setup(args)
            self.assertEqual(usage.config(), {})
            send.assert_not_called()
            args.consent = True
            usage.setup(args)
            self.assertEqual(usage.config()['person'], 'Explicit-name')
            self.assertEqual(send.call_count, 1)
            args.person = None
            usage.setup(args)
            self.assertEqual(usage.config()['person'], 'Explicit-name')
            self.assertEqual(send.call_count, 1)

    def test_unknown_or_failed_response_is_not_accepted(self):
        for data in [{'code':1}, {'hello':'world'}, []]:
            response = unittest.mock.MagicMock()
            response.__enter__.return_value.status = 200
            response.__enter__.return_value.read.return_value = json.dumps(data).encode()
            opener = unittest.mock.MagicMock()
            opener.open.return_value = response
            with patch.object(usage.urllib.request, 'build_opener', return_value=opener):
                with self.assertRaises(ValueError):
                    usage.post_event(self.cfg, {'event_id':'test'})


if __name__ == '__main__':
    unittest.main()
