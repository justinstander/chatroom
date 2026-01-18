Ultra Scalable Low Cost End-To-End Encrypted Completely Private and Anonymous Chat.

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/6c8c1d99b7d542a8bbba08e7225e5526)](https://app.codacy.com/gh/justinstander/chatroom/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

### Running Locally

When AWS asks for a profile name, if you do not want to use --profile-name in API calls, enter: "default".

```
sudo bin/install.sh && bin/configure.sh && bin/authenticate.sh
```

#### Server

To test while developing, you can run your code changes with:

```
./local.mjs connect
./local.mjs clientOpen
./local.mjs disconnect
./local.mjs CORS
./local.mjs message
```

#### Client

```
npm start

https://localhost:8000/client/
```

### Contributing

#### GPG

Sign commits

```
gpg --full-generate-key
gpg --list-secret-keys --keyid-format=long
gpg --armor --export <sec>

git config --global user.signingKey <id>
git config commit.gpgsign true
```

`Add the key: https://github.com/settings/gpg/new`
