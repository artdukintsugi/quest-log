#!/usr/bin/env python3
"""
Quest Log — Arch Stats Server
Run on your Arch machine: python3 quest-stats-server.py
Exposes: http://localhost:7777/stats (JSON)

Set the URL in God Mode → Config: http://YOUR_ARCH_IP:7777
"""

import json
import subprocess
import time
import os
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = 7777

def get_cpu():
    try:
        with open("/proc/stat") as f:
            line = f.readline()
        vals = list(map(int, line.split()[1:]))
        idle1 = vals[3]
        total1 = sum(vals)
        time.sleep(0.1)
        with open("/proc/stat") as f:
            line = f.readline()
        vals = list(map(int, line.split()[1:]))
        idle2 = vals[3]
        total2 = sum(vals)
        return round((1 - (idle2 - idle1) / (total2 - total1)) * 100, 1)
    except:
        return 0.0

def get_ram():
    try:
        info = {}
        with open("/proc/meminfo") as f:
            for line in f:
                k, v = line.split(":")
                info[k.strip()] = int(v.strip().split()[0])
        total = info["MemTotal"] / 1024 / 1024
        available = info["MemAvailable"] / 1024 / 1024
        return round(total - available, 2), round(total, 2)
    except:
        return 0, 0

def get_disk():
    try:
        st = os.statvfs("/")
        total = st.f_blocks * st.f_frsize / 1e9
        free = st.f_bavail * st.f_frsize / 1e9
        return round(total - free, 1), round(total, 1)
    except:
        return 0, 0

def get_uptime():
    try:
        with open("/proc/uptime") as f:
            secs = float(f.read().split()[0])
        h = int(secs // 3600)
        m = int((secs % 3600) // 60)
        if h > 24:
            return f"{h//24}d {h%24}h"
        return f"{h}h {m}m"
    except:
        return "?"

def get_kernel():
    try:
        return subprocess.check_output(["uname", "-r"]).decode().strip()
    except:
        return "?"

def get_hostname():
    try:
        return subprocess.check_output(["hostname"]).decode().strip()
    except:
        return "arch"

def get_now_playing():
    # Try playerctl (works with Spotify, MPD, browsers, etc.)
    try:
        status = subprocess.check_output(
            ["playerctl", "status"], stderr=subprocess.DEVNULL
        ).decode().strip()
        if status == "Playing":
            title = subprocess.check_output(
                ["playerctl", "metadata", "title"], stderr=subprocess.DEVNULL
            ).decode().strip()
            artist = subprocess.check_output(
                ["playerctl", "metadata", "artist"], stderr=subprocess.DEVNULL
            ).decode().strip()
            if artist:
                return f"{artist} — {title}"
            return title
    except:
        pass
    return None

class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # silence access logs

    def do_GET(self):
        if self.path == "/stats":
            ram_used, ram_total = get_ram()
            disk_used, disk_total = get_disk()
            now_playing = get_now_playing()

            data = {
                "cpu": get_cpu(),
                "ram": ram_used,
                "ramTotal": ram_total,
                "disk": disk_used,
                "diskTotal": disk_total,
                "uptime": get_uptime(),
                "hostname": get_hostname(),
                "kernel": get_kernel(),
            }
            if now_playing:
                data["nowPlaying"] = now_playing

            body = json.dumps(data).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    print(f"🟣 Quest Stats Server running on http://0.0.0.0:{PORT}/stats")
    print(f"   Open God Mode and set URL to: http://YOUR_LAN_IP:{PORT}")
    print(f"   (find your IP with: ip addr show | grep 'inet ')")
    print("   Ctrl+C to stop\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
