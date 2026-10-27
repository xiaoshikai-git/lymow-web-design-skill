#!/usr/bin/env python3
"""Opt-in, task-scoped usage events. Python 3.9+, standard library only."""
import argparse
import datetime as dt
import getpass
import hashlib
import json
import os
from pathlib import Path
import re
import sqlite3
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid

SKILL = "lymow-web-design"
NOTICE = ("启用后向负责人指定的飞书多维表格发送：你填写的姓名/代号（留空则生成固定匿名编号）、安装或使用事件、"
          "时间、周、Agent 和 Skill 版本。不发送聊天、文案、素材、文件路径或设备信息。"
          "首次登记安装计一次；每个独立任务计一次使用，不代表任务完成。"
          "失败记录留在本机，下次调用时补发；可随时用 disable 停止。")


def state_dir():
    # Explicit override is useful for isolated tests; never derive an identity from OS data.
    return Path(os.environ.get("LYMOW_USAGE_HOME", "~/.config/lymow-skill-usage")).expanduser()


def config():
    path = state_dir() / "config.json"
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}


def save_config(value):
    root = state_dir()
    root.mkdir(parents=True, exist_ok=True, mode=0o700)
    path = root / "config.json"
    fd = os.open(str(path), os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    os.chmod(path, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(value, f, ensure_ascii=False, indent=2)


def version():
    content = (Path(__file__).resolve().parent.parent / "SKILL.md").read_text(encoding="utf-8")
    match = re.search(r'^  version: [\"\']?([0-9][^\"\'\s]*)', content, re.M)
    return match.group(1) if match else "unknown"


def database():
    db = sqlite3.connect(str(state_dir() / "events.sqlite3"), timeout=5)
    os.chmod(state_dir() / "events.sqlite3", 0o600)
    db.execute("CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, payload TEXT NOT NULL, accepted INTEGER NOT NULL DEFAULT 0)")
    return db


def validate_url(url):
    parts = urllib.parse.urlsplit(url)
    host = parts.hostname or ""
    if (parts.scheme != "https" or parts.username or parts.password or parts.port not in (None, 443)
            or not (host == "feishu.cn" or host.endswith(".feishu.cn"))
            or not parts.path.startswith("/base/automation/webhook/event/")):
        raise ValueError("需要飞书多维表格自动化的 HTTPS Webhook 地址（不是群机器人地址）。")
    return url


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def post_event(cfg, payload):
    validate_url(cfg["webhook"])
    headers = {"Content-Type": "application/json"}
    if cfg.get("token"):
        headers["Authorization"] = "Bearer " + cfg["token"]
    request = urllib.request.Request(cfg["webhook"], json.dumps(payload, ensure_ascii=False).encode("utf-8"), headers, method="POST")
    opener = urllib.request.build_opener(NoRedirect())
    with opener.open(request, timeout=4) as response:
        body = response.read(32768)
        if response.status != 200:
            raise ValueError("Webhook 未接受请求")
        data = json.loads(body)
        # A successful trigger response does not prove the downstream table action succeeded.
        if not isinstance(data, dict) or data.get("code") != 0:
            raise ValueError("Webhook 业务返回未成功")


def flush(cfg, db):
    accepted = 0
    # Bounded catch-up, with spacing for Feishu's unauthenticated 1/s limit.
    db.execute("BEGIN IMMEDIATE")
    rows = db.execute("SELECT id, payload FROM events WHERE accepted=0 ORDER BY rowid LIMIT 3").fetchall()
    for i, row in enumerate(rows):
        if i:
            time.sleep(1.1)
        try:
            post_event(cfg, json.loads(row[1]))
        except (OSError, ValueError, urllib.error.URLError):
            print("统计暂未送达，已留在本机；下次调用自动补发。页面工作可继续。")
            break
        else:
            db.execute("UPDATE events SET accepted=1 WHERE id=?", (row[0],))
            accepted += 1
    db.commit()
    return accepted


def event(cfg, kind, task, agent):
    # Task IDs are hashed locally; raw task/thread identifiers never leave this process.
    key = hashlib.sha256((cfg["registration_id"] + ":" + kind + ":" + task).encode()).hexdigest()
    now = dt.datetime.now(dt.timezone(dt.timedelta(hours=8)))
    iso = now.isocalendar()
    payload = {
        "event_id": key, "person": cfg["person"], "event": kind,
        "occurred_at": now.isoformat(timespec="seconds"),
        "week": f"{iso.year}-W{iso.week:02d}", "count": 1,
        "skill": SKILL, "skill_version": version(), "agent": agent,
    }
    with database() as db:
        db.execute("INSERT OR IGNORE INTO events(id,payload) VALUES(?,?)", (key, json.dumps(payload, ensure_ascii=False)))
        db.commit()
        accepted = flush(cfg, db)
        pending = db.execute("SELECT count(*) FROM events WHERE accepted=0").fetchone()[0]
    print(json.dumps({"webhook_accepted": accepted, "pending": pending}, ensure_ascii=False))


def setup(args):
    old = config()
    print(NOTICE)
    if not args.consent:
        if not sys.stdin.isatty() or input("已阅读并同意？输入 YES：").strip() != "YES":
            print("未启用，不发送任何记录。")
            return
    registration_id = old.get("registration_id") or str(uuid.uuid4())
    person = args.person
    if person is None and not old and sys.stdin.isatty():
        person = input("姓名或唯一代号（可留空，自动分配固定匿名编号）：")
    person = (person or '').strip() or old.get('person') or (
        '同事-' + hashlib.sha256(registration_id.encode()).hexdigest()[:16])
    if len(person) > 80:
        raise ValueError("姓名/代号不能超过80个字符")
    receiver = {}
    if args.receiver_file:
        receiver = json.loads(Path(args.receiver_file).expanduser().read_text(encoding='utf-8'))
    webhook = os.environ.get("LYMOW_FEISHU_WEBHOOK") or receiver.get('webhook') or old.get('webhook') or getpass.getpass("飞书自动化 Webhook（输入不显示）：")
    token = os.environ.get("LYMOW_FEISHU_TOKEN", receiver.get('token', old.get('token')))
    if token is None:
        token = getpass.getpass("Bearer 凭证（未启用凭证校验则留空）：")
    validate_url(webhook)
    if old and (old.get("person") != person or old.get("webhook") != webhook):
        raise ValueError("该本机统计配置已绑定其他姓名或目标；请使用独立 LYMOW_USAGE_HOME，避免混传旧事件。")
    cfg = {"enabled": True, "person": person, "webhook": webhook, "token": token,
           "registration_id": registration_id,
           "consent_at": dt.datetime.now(dt.timezone.utc).isoformat()}
    save_config(cfg)
    print('统计身份：' + person)
    event(cfg, "install", "first-enrollment", args.agent)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    subs = parser.add_subparsers(dest="command", required=True)
    s = subs.add_parser("setup", help="一次性告知、配置身份与目标，并登记已安装的 Skill")
    s.add_argument("--person")
    s.add_argument("--receiver-file", help="负责人私下提供的接收配置JSON；不输出其内容")
    s.add_argument("--consent", action="store_true", help="仅在已取得当事人知情同意后使用")
    s.add_argument("--agent", choices=["codex", "claude-code", "cursor", "other"], default="codex")
    r = subs.add_parser("record", help="由 AI 在新任务开始时调用一次")
    r.add_argument("--task-id", required=True, help="每个独立任务的稳定随机 ID；同任务重试必须复用")
    r.add_argument("--agent", choices=["codex", "claude-code", "cursor", "other"], default="other")
    subs.add_parser("status")
    subs.add_parser("flush")
    subs.add_parser("disable")
    args = parser.parse_args()
    if args.command == "setup":
        setup(args)
        return
    cfg = config()
    if args.command == "disable":
        if cfg:
            cfg["enabled"] = False
            save_config(cfg)
        print("统计已停用，不会发送待处理事件。")
        return
    if args.command == "status":
        print(json.dumps({"enabled": cfg.get("enabled", False), "person": cfg.get("person")}, ensure_ascii=False))
        return
    if not cfg.get("enabled"):
        print("统计未启用：不记录、不联网。")
        return
    if args.command == "record":
        if not args.task_id.strip() or len(args.task_id) > 200:
            raise ValueError("任务 ID 必须是 1–200 个字符")
        event(cfg, "run", args.task_id, args.agent)
    elif args.command == "flush":
        with database() as db:
            print(json.dumps({"webhook_accepted": flush(cfg, db)}))


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, sqlite3.Error):
        # Never print exceptions: URLs, tokens and request data can appear in their messages.
        print("统计操作未完成；检查本机配置或运行环境。未影响页面任务。", file=sys.stderr)
        sys.exit(1)
