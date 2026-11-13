# Alice au Pays des Merveilles CTF

> « Commencez par le commencement, continuez jusqu'à la fin, puis arrêtez-vous. »

Bienvenue dans le terrier. Ce CTF (Capture The Flag) est une série d'énigmes à résoudre dans une machine virtuelle Linux. Il est pensé pour **apprendre les outils de la ligne de commande**, pas pour vous piéger. Chaque énigme vous fait pratiquer une commande de base et vous donne un **flag** à soumettre sur la plateforme de score.

Les énigmes ne vous disent pas quel outil utiliser. À vous de lire, d'observer et de choisir dans la boîte à outils plus bas.

---

## 1. Comment ça marche

1. Vous téléchargez et démarrez la **machine virtuelle** fournie par l'organisateur.
2. Vous vous inscrivez sur la plateforme **CTFd** (adresse donnée par l'organisateur) pour soumettre vos flags et suivre le tableau des scores.
3. Dans la VM, vous cherchez les flags avec les outils décrits plus bas.
4. Chaque flag trouvé se soumet sur CTFd. Il a toujours cette forme :

```
flag{...}
```

La plateforme de score sert **uniquement** à soumettre et à comparer les résultats. Les énigmes, elles, se trouvent **dans la VM**.

---

## 2. Prérequis

* Un ordinateur sous Linux (ou capable de lancer une machine virtuelle)
* Un hyperviseur, par exemple **VirtualBox** ou **VMware Worksation**
* Un navigateur web
* Les outils de la boîte à outils ci-dessous installés sur votre machine

Si votre VM n'obtient pas d'adresse IP, vérifiez le mode réseau de la carte virtuelle et suivez les instructions de l'organisateur. Trouver l'adresse de la VM fait partie du jeu.

---

## 3. Avant tout : apprendre à s'aider soi-même

C'est la compétence la plus importante de ce CTF, et probablement de tout votre parcours en informatique. **Personne ne connaît toutes les commandes par cœur.** On apprend à retrouver l'information vite.

### Réflexe n°1 : `--help` et `-h`

Presque toutes les commandes affichent un court résumé de leur utilisation :

```sh
ls --help
```

ou parfois :

```sh
ls -h
```

Attention, `-h` ne veut pas toujours dire « aide ». Sur certaines commandes, c'est une autre option (par exemple « lisible par un humain » pour les tailles de fichiers). Si `-h` ne fait pas ce que vous attendez, essayez `--help`.

Quand le résultat est trop long pour l'écran, envoyez-le dans un lecteur de pages :

```sh
ls --help | less
```

Dans `less`, les flèches et la barre d'espace font défiler, `/mot` cherche un mot, `n` va au résultat suivant et `q` quitte.

### Réflexe n°2 : `man`

`man` (pour *manual*) ouvre le manuel complet d'une commande :

```sh
man ls
```

Comment le lire :

| Touche | Action |
|--------|--------|
| Flèches, barre d'espace | Faire défiler |
| `/mot` puis Entrée | Chercher un mot |
| `n` | Résultat suivant |
| `q` | Quitter |

Un manuel est organisé en sections : **NAME** (à quoi sert la commande), **SYNOPSIS** (comment l'écrire), **DESCRIPTION** et **OPTIONS** (ce que chaque lettre fait). Pour chercher une commande dont vous ne connaissez pas le nom :

```sh
man -k mot
```

Par exemple, cherchez un mot lié à ce que vous voulez faire, comme « permission » ou « encode ».

### Si `man` n'existe pas dans la VM

La VM est volontairement légère, et les pages de manuel n'y sont peut-être pas installées. Dans ce cas :

* utilisez `--help`, qui fonctionne presque partout
* ouvrez `man` **sur votre propre machine** (les commandes sont les mêmes)
* cherchez la documentation en ligne, c'est un réflexe professionnel

Dernière chose : **lisez les messages d'erreur**. Ils vous disent souvent exactement ce qui manque.

---

## 4. La boîte à outils

Voici les outils que vous allez croiser, classés par ordre alphabétique. On vous explique **ce qu'ils font**. À vous de deviner **quand** les utiliser, en lisant bien ce que chaque énigme vous met sous les yeux.

| Outil | À quoi il sert |
|-------|----------------|
| `base64` | Encode ou décode du texte avec l'encodage Base64. Ce n'est pas un chiffrement : n'importe qui peut le défaire avec le bon outil. |
| `cat` | Affiche le contenu d'un fichier à l'écran. |
| `chmod` | Modifie les permissions d'un fichier (lecture, écriture, exécution). Utile avec `ls -l`, qui les affiche. |
| `curl` | Récupère le contenu d'une adresse web et l'affiche en texte brut, sans passer par le navigateur. Il peut aussi montrer les en-têtes de la réponse. |
| `grep` | Cherche un mot ou un motif dans du texte et n'affiche que les lignes qui correspondent. |
| `ip` | Affiche et configure le réseau de la machine, par exemple ses adresses. |
| `less` | Affiche un long texte page par page, avec recherche. |
| `ls` | Liste le contenu d'un dossier. Ses options changent beaucoup ce qu'il montre. |
| `nc` (netcat) | Ouvre une connexion brute vers un port d'une machine, ou écoute sur un port. Un couteau suisse du réseau. |
| `nmap` | Explore une machine à travers le réseau et liste les ports ouverts et les services qui répondent. |
| `ssh` | Ouvre une session sur une autre machine à travers le réseau, de façon chiffrée. Il faut une adresse, un utilisateur et un mot de passe. |
| `\|` (le tube) | Envoie le résultat d'une commande en entrée d'une autre, par exemple `commande1 \| commande2`. |

### Aussi utiles

* Le **navigateur** : la touche `F12` ouvre les outils de développement, qui montrent ce que contient réellement une page.
* `history` : liste les commandes déjà tapées. La flèche du haut les rappelle.
* `echo` : affiche du texte, pratique avec un tube.

Pour chaque outil, la première chose à faire est la même : `outil --help`, puis `man outil`.

---

## 5. Méthode de travail

* **Lisez avant de taper.** Un manuel de deux minutes évite une heure d'essais au hasard.
* **Observez.** Chaque énigme contient des indices dans son texte, ses messages et ses fichiers. Posez-vous la question : qu'est-ce que je vois, et qu'est-ce que je ne vois pas ?
* **Testez petit.** Une commande à la fois, et regardez ce qu'elle fait.
* **Notez ce que vous apprenez.** Garder une liste personnelle de commandes est une excellente habitude.
* **Cherchez en ligne**, mais cherchez le *concept* (par exemple « comment afficher le contenu d'un fichier linux »), pas « la solution du CTF ».

---

## 6. Règles du jeu

1. Restez dans **votre propre VM**. N'essayez jamais d'attaquer la plateforme de score, le réseau ni les machines des autres participants.
2. Ne partagez pas vos flags. Aidez-vous entre vous avec des **conseils**, pas des réponses.
3. Si vous cassez quelque chose dans la VM, vous pouvez toujours la réimporter à partir de l'image d'origine.
4. Amusez-vous. Se tromper fait partie de l'apprentissage.

---

## 7. En cas de blocage

* Relisez l'énoncé de l'énigme et le message d'erreur.
* Relisez `--help` et `man` pour l'outil que vous pensez utiliser.
* Demandez un indice à l'organisateur avant de demander la solution.

> « On est tous fous ici. » Le Chat du Cheshire