Readme · MD
# Nginx Setup — Alice in Wonderland CTF
 
This document covers how to configure nginx to serve the CTF web interface using symbolic links, so any update made inside the cloned repository is reflected immediately across the system without copying files manually.
 
---
 
## 1. Clone the Repository
 
```sh
git clone https://github.com/Badr-Ed/AIWL-CTF.github.io ./AIWL-CTF
```
 
---
 
## 2. Create the Symlinks for Web Files
 
Link the project files into the nginx web root. This way, editing anything inside `./AIWL-CTF/` updates the live site automatically.
 
```sh
ln -s ./AIWL-CTF/Source/web                  /var/www/html/alice-ctf.local/Source/web
ln -s ./AIWL-CTF/alice-ctf.local/index.html  /var/www/html/alice-ctf.local/index.html
ln -s ./AIWL-CTF/start.js                    /var/www/html/start.js
ln -s ./AIWL-CTF/style.css                   /var/www/html/alice-ctf.local/style.css
```
 
> **Note:** Make sure the target directories exist before running `ln -s`, otherwise the symlink will be created but will point to nothing. For example:
> ```sh
> mkdir -p /var/www/html/alice-ctf.local/Source/
> ```
 
---
 
## 3. Link the Nginx Configuration
 
Instead of copying the config file into `/etc/nginx/sites-available/`, link it directly from the repository. One file, one place to edit.
 
```sh
ln -s ./AIWL-CTF/nginx/sites-available/alice-ctf.local  /etc/nginx/sites-available/alice-ctf.local
```
 
Then enable the site by linking it into `sites-enabled`:
 
```sh
ln -s /etc/nginx/sites-available/alice-ctf.local  /etc/nginx/sites-enabled/alice-ctf.local
```
 
Verify the config is valid before reloading:
 
```sh
nginx -t
```
 
Reload nginx to apply:
 
```sh
systemctl reload nginx
# or on Alpine:
rc-service nginx reload
```
 
---
 
## 4. Files in This Directory
 
| File | Purpose |
|------|---------|
| `sites-available/alice-ctf.local` | Nginx virtual host config for the CTF, link this into `/etc/nginx/sites-available/` |
 
---
 
## 5. Workflow After Any Update
 
Since everything is symlinked back to the repository, the update cycle is:
 
```sh
cd ./AIWL-CTF
# edit whatever needs changing
git add .
git commit -m "your message"
git push
```
 
No need to copy files or reload nginx for content changes. For nginx config changes, run `nginx -t && rc-service nginx reload` or `nginx -t && systemctl reload nginx` after the edit.
 
