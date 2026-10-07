# Nginx Setup: Alice in Wonderland CTF (Alpine Linux)
 
This guide serves the CTF web interface with nginx on Alpine Linux, using symbolic links so the cloned repository stays the single source of truth. Edit a file inside the repo and the live site changes with it.
 
Tested on Alpine with nginx 1.30. The layout differs from Debian and Ubuntu: Alpine has no `sites-available` or `sites-enabled`, it loads every `*.conf` file from `/etc/nginx/http.d/`.
 
---
 
## 1. Install nginx
 
```sh
apk add nginx
rc-update add nginx default
```
 
---
 
## 2. Clone the repository
 
Clone outside `/root`. That folder is mode 700, so the nginx worker user cannot read through it and every request ends in `403 Forbidden`.
 
```sh
mkdir -p /opt/ctf
cd /opt/ctf
git clone https://github.com/Badr-Ed/AIWL-CTF.github.io AIWL-CTF
chmod -R o+rX /opt/ctf/AIWL-CTF
```
 
Capital `X` adds execute on directories only, not on regular files. Also make sure the parent folders can be walked through:
 
```sh
chmod o+x /opt /opt/ctf
```
 
---
 
## 3. Create the web root and link the site files
 
All of these must live inside the web root (`/var/www/html/alice-ctf.local`). A file outside it is not served, which is why `start.js` goes in the site folder too.
 
```sh
mkdir -p /var/www/html/alice-ctf.local/Source
 
ln -sfn /opt/ctf/AIWL-CTF/alice-ctf.local/index.html /var/www/html/alice-ctf.local/index.html
ln -sfn /opt/ctf/AIWL-CTF/start.js                   /var/www/html/alice-ctf.local/start.js
ln -sfn /opt/ctf/AIWL-CTF/style.css                  /var/www/html/alice-ctf.local/style.css
ln -sfn /opt/ctf/AIWL-CTF/Source/web                 /var/www/html/alice-ctf.local/Source/web
```
 
Notes on the command:
 
| Flag | Purpose |
|------|---------|
| `-s` | create a symbolic link |
| `-f` | replace an existing link instead of failing |
| `-n` | do not descend into an existing directory link (avoids `Source/web/web`) |
 
**Always use an absolute path for the link target.** A relative target is resolved from the folder where the link lives, not from where you ran the command, so a relative link usually ends up dangling.
 
---
 
## 4. Link the nginx configuration
 
The config file is in this repo at `nginx/http.d/alice-ctf.conf`. Link it into Alpine's include folder:
 
```sh
ln -sfn /opt/ctf/AIWL-CTF/nginx/http.d/alice-ctf.conf /etc/nginx/http.d/alice-ctf.conf
```
 
The `.conf` extension is required. A file without it is ignored.
 
Move the stock config out of the way. It also declares `default_server` on port 80, which conflicts with ours:
 
```sh
mv /etc/nginx/http.d/default.conf /etc/nginx/http.d/default.conf.bak
```
 
The `.bak` name is ignored by nginx, so the original stays available for reference.
 
---
 
## 5. Test and start
 
```sh
nginx -t
rc-service nginx restart
curl -I http://localhost/
```
 
A healthy result is `HTTP/1.1 200 OK`. Also check the script and stylesheet:
 
```sh
curl -I http://localhost/start.js
curl -I http://localhost/style.css
```
 
---
 
## 6. Troubleshooting
 
| Symptom | Likely cause | Check |
|---------|--------------|-------|
| `403 Forbidden`, log says `Permission denied (13)` | nginx user cannot walk the path | `namei -l /var/www/html/alice-ctf.local/index.html`, look for a folder missing `x` for others |
| `403 Forbidden`, log says `directory index ... is forbidden` | no readable `index.html`, often a dangling link | `readlink -f /var/www/html/alice-ctf.local/index.html` prints nothing if broken |
| `404 Not Found` on a file that exists | file is outside the web root | the folder name in `root` must match the real folder exactly (hyphen vs dot) |
| `unknown directive` in `nginx -t` | typo, missing `;`, or server block pasted in the wrong file | the error names the file and line |
| `duplicate default server` | stock `default.conf` still active | rename it to `default.conf.bak` |
 
Useful commands:
 
```sh
tail -n 20 /var/log/nginx/error.log
ls -l /var/www/html/alice-ctf.local/
su -s /bin/sh nginx -c "head -3 /var/www/html/alice-ctf.local/index.html"
```
 
The last one reads the file as the nginx user, which tells you whether permissions are the problem without involving nginx at all. `namei` comes from `apk add util-linux-misc` if it is missing.
 
---
 
## 7. Files in this directory
 
| File | Purpose |
|------|---------|
| `http.d/alice-ctf.conf` | nginx server block, linked into `/etc/nginx/http.d/` |
| `README.md` | this guide |
 
---
 
## 8. Updating
 
Because everything is linked back to the repo:
 
```sh
cd /opt/ctf/AIWL-CTF
git pull
```
 
Content changes are live immediately. After editing the nginx config, run:
 
```sh
nginx -t && rc-service nginx reload
```
 
---
 
## Next: flag submission
 
The `/submit` block in `alice-ctf.conf` is commented out. Uncomment it once the Flask API is listening on `127.0.0.1:5000`.
 
47/47
